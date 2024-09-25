const db = require("../../data/db-config.js");

function find() { 
    return db("schemes as sc")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .leftJoin("steps as st", {"sc.scheme_id": "st.scheme_id"})
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc")
}

async function findById(scheme_id) { 
    const scheme = await db('schemes as sc')
    .select('sc.*')
    .where('sc.scheme_id', scheme_id)
    .count('st.step_id as number_of_steps')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('st.scheme_id', "ASC")
    .first()
    if(scheme){
      const steps = await db('schemes as sc')
        .select('sc.scheme_name', 'st.*')
        .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
        .where('sc.scheme_id', scheme_id)
        .orderBy('st.step_number', 'asc');
        if(steps[0].step_id === null || !steps) {
          scheme.steps = [];
        } else {
          scheme.steps = steps;
        }
    }
    return scheme;
  }

async function findSteps(scheme_id) { 
    const rows = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("st.step_id", "st.step_number", "instructions", "sc.scheme_name")
    .where("sc.scheme_id", scheme_id)
    .orderBy("step_number")
    if(!rows[0].step_id) return []
    return rows
}

function add(scheme) { // EXERCISE D
  return db("schemes")
  .insert(scheme)
  .then(([scheme_id]) => {
    return db("schemes").where('scheme_id', scheme_id).first()
  })
}

function addStep(scheme_id, step) { // EXERCISE E
  return db('steps')
  .insert({
    ...step,
    scheme_id
  })
    .then(() => {
      return db('steps as st')
      .join("schemes as sc", "sc.scheme_id", "st.scheme_id")
      .select("step_id", "step_number", "instructions", "scheme_name")
      .orderBy("step_number")
      .where("sc.scheme_id", scheme_id)
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}

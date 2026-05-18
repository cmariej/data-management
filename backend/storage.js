const supabase = require('./supabase');

async function loadProject(projectName) {
  const { data, error } = await supabase.storage
    .from('projects')
    .download(`${projectName}/project.json`);

  if (error) {
    throw error;
  }

  const text = await data.text();

  return JSON.parse(text);
}

async function saveProject(projectName, jsonData) {
  const json = JSON.stringify(jsonData, null, 2);

  const { error } = await supabase.storage
    .from('projects')
    .upload(
      `${projectName}/project.json`,
      Buffer.from(json),
      {
        upsert: true,
        contentType: 'application/json'
      }
    );

  if (error) {
    throw error;
  }
}

module.exports = {
  loadProject,
  saveProject
};
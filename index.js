const core = require("@actions/core");
const github = require("@actions/github");

try {
  const octokit = github.getOctokit(core.getInput("github_token"));
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const branch = core.getInput("branch");
  octokit.actions
    .listWorkflowRuns({
      owner,
      repo,
      workflow_id: core.getInput("workflow_id"),
      status: "success",
      branch,
      event: "push",
    })
    .then((res) => {
      core.debug('workflow_runs.length: ' + res.data.workflow_runs.length);
      const lastSuccessCommitHash =
        res.data.workflow_runs.length > 0
          ? res.data.workflow_runs[0].head_commit.id
          : branch;
      core.debug('lastSuccessCommitHash: ' + lastSuccessCommitHash);
      core.setOutput("commit_hash", lastSuccessCommitHash);
    })
    .catch((e) => {
      core.setFailed(e.message);
    });
} catch (e) {
  core.setFailed(e.message);
}

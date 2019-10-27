const fetch = require("node-fetch");
const rls = require("readline-sync");
const fs = require("fs");
const registry = require("./plugins/registry.json");

console.log("!!!");
console.log("");
console.log("Welcome to the plugin installer. You can press Ctrl + C to quit anytime.");
console.log("");
console.log("!!!");

async function main () {
  while (true) {
    const input = rls.question("\nPlease enter the name of the plugin you want to install, if the plugin is not on registry, use <User>/<Repository Name>[@tree] to install it from github.\nDO NOT INCLUDE <> OR []! Tree is fully optional, the default is master: ");
    if (input.length < 1) return;

    if (registry[input]) {
      console.log(`Downloading ${registry[input].title}.`);

      const body = await fetch(`https://api.github.com/repos/${registry[input].repository}/git/trees/${registry[input].tree}?recursive=1`, {
        headers: { "User-Agent": "mod-mail" }
      });

      const json = await body.json();
      if (!json.tree) {
        console.log("!!!");
        console.log("");
        console.log("GitHub rate-limit has been hit, try again in 1 hour.");
        console.log("");
        console.log("!!!");
        process.exit(1);
      }

      for (var i = 0; i < json.tree.length; i++) {
        const rawFile = await fetch(`https://api.github.com/repos/${registry[input].repository}/contents/${json.tree[i].path}`, {
          headers: { "User-Agent": "MrAugu" }
        });

        var file = await rawFile.json();
        var contents;
        if (file.contents) contents = Buffer.from(file.content, "base64").toString("ascii");
        if (!file.contents) contents = await(await (fetch(`${file.download_url}`, {
          headers: { "User-Agent": "MrAugu" }
        })).text());

        await fs.appendFile(`pluins/${registry[input].name}/` + json.tree[i].path, `${contents}`, (e) => {});
      }
    } else {
      var [user, repo] = input.split("/");
      if (user && repo) {
        var repository;
        var tree;

        if (repo.includes("@")) {
          repository = repo.split("@")[0];
          tree = repo.split("@")[1];
        } else {
          repository = repo;
          tree = "master";
        }

        console.log(user, repository, tree);

        if (user && repository && tree) {
          console.log(`Downloading ${user}/${repository}.`);

          const body = await fetch(`https://api.github.com/repos/${user}/${repository}/git/trees/${tree}?recursive=1`, {
            headers: { "User-Agent": "mod-mail" }
          });

          // Check if is a valid repository.

          const json = await body.json();
          if (!json.tree) {
            console.log("!!!");
            console.log("");
            console.log("GitHub rate-limit has been hit, try again in 1 hour.");
            console.log("");
            console.log("!!!");
            process.exit(1);
          }

          const fileMap = json.tree.map(i => i.name);
          if (!fileMap.includes("main.js") && !fileMap.includes("meta.json")) return console.log("\nSpecified repository is NOT a plugin.\n");

          for (var i = 0; i < json.tree.length; i++) {
            const rawFile = await fetch(`https://api.github.com/repos/${user}/${repository}/contents/${json.tree[i].path}`, {
              headers: { "User-Agent": "MrAugu" }
            });

            var file = await rawFile.json();
            var contents;
            if (file.contents) contents = Buffer.from(file.content, "base64").toString("ascii");
            if (!file.contents) contents = await(await (fetch(`${file.download_url}`, {
              headers: { "User-Agent": "MrAugu" }
            })).text());

            await fs.appendFile(`pluins/${registry[input].name}/` + json.tree[i].path, `${contents}`, (e) => {});
          }
        }
      }
      return console.log("\nInvalid repository.\n");
      console.log(user, repository, tree);
    }
  }
}

main();

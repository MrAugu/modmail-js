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

      json.tree = json.tree.filter(i => i.path.includes("."));

      await fs.mkdir(`pluins/${registry[input].name}`, { recursive: true }, (err) => {
        if (err) err;
      });

      var folders = json.tree.filter(i => i.path.includes("/"));
      folders = folders.map(f => f.path);

      for (var x = 0; x < folders.length; x++) {
        var fds = folders[x].split("/");
        fds.pop();

        await fs.mkdir(`plugins/${registry[input].name}/` + fds.join("/"), { recursive: true }, (err) => {
          if (err) throw err;
        });
      }

      for (var i = 0; i < json.tree.length; i++) {
        const rawFile = await fetch(`https://raw.githubusercontent.com/${registry[input].repository}/${registry[input].tree}/${json.tree[i].path}`, {
          headers: { "User-Agent": "MrAugu" }
        });

        var file = await rawFile.text();

        await fs.appendFile(`plugins/${registry[input].name}/` + json.tree[i].path, `${file}`, (e) => {
          if (e) console.log(e);
        });
      }
      console.log("\nPlugin downloaded!");
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

        if (user && repository && tree) {
          console.log(`Downloading ${user}/${repository}.`);

          const body = await fetch(`https://api.github.com/repos/${user}/${repository}/git/trees/${tree}?recursive=1`, {
            headers: { "User-Agent": "mod-mail" }
          });

          const json = await body.json();

          if (json.message && json.message === "Not Found") {
            console.log("\nRepository does not exist on GitHub.\n");
            process.exit(1);
          }

          if (!json.tree) {
            console.log("!!!");
            console.log("");
            console.log("GitHub rate-limit has been hit, try again in 1 hour.");
            console.log("");
            console.log("!!!");
            process.exit(1);
          }

          const fileMap = json.tree.map(i => i.path);
          if (!fileMap.includes("main.js") || !fileMap.includes("meta.json")) {
            console.log("Repository not a valid modmail plugin.");
            process.exit(1);
          }

          var meta = await fetch(`https://raw.githubusercontent.com/${user}/${repository}/${tree}/meta.json`, {
            headers: { "User-Agent": "MrAugu" }
          });

          meta = await meta.text();

          try {
            meta = JSON.parse(meta)
          } catch (e) {
            console.log("Not plugin metadata could not be parsed.");
            process.exit(1);
          }

          if (!meta.name) {
            console.log("Name does not have a plugin, name could not be determined.");
            process.exit(1);
          }

          const metaName = `${meta.name}`.toLowerCase().replace(/\s/g, "-");

          json.tree = json.tree.filter(i => i.path.includes("."));

          await fs.mkdir(`pluins/${metaName}`, { recursive: true }, (err) => {
            if (err) throw err;
          });

          var folders = json.tree.filter(i => i.path.includes("/"));
          folders = folders.map(f => f.path);

          for (var x = 0; x < folders.length; x++) {
            var fds = folders[x].split("/");
            fds.pop();

            await fs.mkdir(`plugins/${metaName}/` + fds.join("/"), { recursive: true }, (err) => {
              if (err) throw err;
            });
          }

          for (var i = 0; i < json.tree.length; i++) {
            const rawFile = await fetch(`https://raw.githubusercontent.com/${user}/${repository}/${tree}/${json.tree[i].path}`, {
              headers: { "User-Agent": "MrAugu" }
            });

            var file = await rawFile.text();

            await fs.appendFile(`plugins/${metaName}/` + json.tree[i].path, `${file}`, (e) => {
              if (e) throw e;
            });
          }

          console.log("\nPlugin downloaded!");
        } else {
          return console.log("\nInvalid repository.\n");
        }
      } else {
        return console.log("\nInvalid repository.\n");
      }
    }
  }
}

main();

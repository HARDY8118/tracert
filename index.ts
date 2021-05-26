import "axios";
import axios from "axios";
import express = require("express");
// import express from "express";
import { exec } from "child_process";
import open = require("open");

interface Jumps {
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
  ip: string;
}

exec("traceroute example.com", async (err, std, out) => {
  if (err) {
    console.log("Error getting route");
    console.log(err);
    process.exit();
  }

  // console.log(std);
  const reg: RegExp = /\(([^)]+)\)/g;
  const ipLists: string[] = Array.from(
    new Set(std.match(reg)?.map((i) => i.substr(1, i.length - 2)))
  );

  const route: any = [];
  axios
    .all(ipLists.map((ip) => axios.get(`http://ip-api.com/json/${ip}`)))
    .then((resp) => {
      resp = resp.filter((r) => r.status == 200);
      resp = resp.map((r) => r.data);
      return resp;
    })
    .then((routes) => {
      // console.log(routes);

      const app = express();

      const PORT = 5555;
      let quit = false;

      app.set("view engine", "ejs");
      app.use(express.static("static"));

      app.get("/", (req, res) => {
        res.render("main");
      });

      app.get("/route", (req, res) => {
        setTimeout(() => {
          console.log("Cleaning local server");
          server.close();
          process.exit();
        });
        console.log("Sending Route");
        res.json(routes);
      });

      const server = app.listen(PORT, () => {
        console.log("Opening browser");
        open(`http://localhost:${PORT}/`);
        // process.on("SIGINT", () => {
        //   // TODO Close browser window
        //   server.close();

        //   // console.log('Exit')
        //   process.exit();
        // });
      });
    });
});

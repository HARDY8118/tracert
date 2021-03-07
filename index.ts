import * as http from "http";
// import 'open';
import { exec } from "child_process";

interface Jumps {
  country: string;
  countrycode: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
  ip: string;
  //   message?: string;
}

const traceip = (ip: string) =>
  new Promise<Jumps>((resolve, reject) => {
    const options = {
      hostname: "ip-api.com",
      post: 80,
      path: `/json/${ip}`,
      method: "GET",
    };

    const req = http.request(options, (res) => {
      if (res.statusCode == 200) {
        res.on("data", (d: Buffer) => {
          // console.log(d.toString());
          const {
            status,
            //   message,
            country,
            countrycode,
            city,
            lat,
            lon,
            isp,
            query: ip,
          } = JSON.parse(d.toString());

          if (status == "success") {
            // route.push({ country, countrycode, city, lat, lon, isp, ip });
            resolve({ country, countrycode, city, lat, lon, isp, ip });
          }
        });
      } else {
        console.log(`Request failed with status code: ${res.statusCode}`);
        console.log(res.statusMessage);
      }
    });

    req.on("error", (e) => {
      console.error(e);
      reject(e);
      process.exit();
    });
    req.end();
  });

const trace = (iplist: string[]) =>
  new Promise<Jumps[]>(async (resolve, reject) => {
    try {
      let route: Jumps[] = [];
      let promiseList = Promise.all(
        iplist.map(async (ip: string) => {
          try {
            // console.log(ip);
            const r = await traceip(ip);
            route.push(r);
            console.log(r);
            // resolve(route);
          } catch (e) {
            console.error(e);
          }
        })
      );
      resolve(route);
      // return route;
    } catch (e) {
      console.error(e);
    }
  });

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

  //   console.log(ipLists);

  try {
    const route: Jumps[] = await trace(ipLists);
    // const route: Jumps[] = await trace(ipLists);
    console.log(route);
  } catch (e) {
    console.error("ERROR");
    console.error(e);
    process.exit();
  }

  //   for (let i of ipLists.values()) {
});

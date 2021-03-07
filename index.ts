import "axios";
import axios from "axios";
// import 'open';
import { exec } from "child_process";

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
      console.log(routes);
    });
});

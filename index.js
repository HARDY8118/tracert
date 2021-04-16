"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("axios");
var axios_1 = require("axios");
var express = require("express");
// import express from "express";
var child_process_1 = require("child_process");
var open = require("open");
child_process_1.exec("traceroute --max-hops=3 example.com", function (err, std, out) { return __awaiter(void 0, void 0, void 0, function () {
    var reg, ipLists, route;
    var _a;
    return __generator(this, function (_b) {
        if (err) {
            console.log("Error getting route");
            console.log(err);
            process.exit();
        }
        console.log(std);
        reg = /\(([^)]+)\)/g;
        ipLists = Array.from(new Set((_a = std.match(reg)) === null || _a === void 0 ? void 0 : _a.map(function (i) { return i.substr(1, i.length - 2); })));
        route = [];
        axios_1["default"]
            .all(ipLists.map(function (ip) { return axios_1["default"].get("http://ip-api.com/json/" + ip); }))
            .then(function (resp) {
            resp = resp.filter(function (r) { return r.status == 200; });
            resp = resp.map(function (r) { return r.data; });
            return resp;
        })
            .then(function (routes) {
            // console.log(routes);
            var app = express();
            var PORT = 5555;
            var quit = false;
            app.set("view engine", "ejs");
            app.use(express.static("static"));
            app.get("/", function (req, res) {
                res.render("main");
            });
            app.get("/route", function (req, res) {
                setTimeout(function () {
                    console.log("Cleaning local server");
                    server.close();
                    process.exit();
                });
                console.log("Sending Route");
                res.json(routes);
            });
            // app.get("/events", (req, res) => {
            //   if (req.headers.accept && req.headers.accept === "text/event-stream")
            //     res.writeHead(200, {
            //       "Content-Type": "text/event-stream",
            //       Connection: "keep-alive",
            //       "Cache-Control": "no-cache",
            //     });
            //   setInterval(() => {
            //     res.write(`id: ${Date.now()}\ndata: ${quit}\nevent: sigint\n\n`);
            //   }, 2000);
            // });
            var server = app.listen(PORT, function () {
                console.log("Opening browser");
                open("http://localhost:" + PORT + "/");
                // process.on("SIGINT", () => {
                //   // TODO Close browser window
                //   server.close();
                //   // console.log('Exit')
                //   process.exit();
                // });
            });
        });
        return [2 /*return*/];
    });
}); });

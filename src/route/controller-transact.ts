import express, {Request, Response, NextFunction, request} from 'express';
const server = express();
const router = express.Router();
import {Proto} from "./interface";
//import {v4 as uuidv4} from "uuid";
import { prototype } from "events";
import { AnyAaaaRecord } from 'dns';
import path from "path";
import fs from 'fs';



let dataTransact = JSON.parse( fs.readFileSync(path.resolve(__dirname, "../transaction.json"), "utf8") );
let tansactData = path.resolve(__dirname,"../transaction.json");





  module.exports = router;
  
import express, {Request, Response, NextFunction, request} from 'express';
const server = express();
const router = express.Router();
import {Proto} from "./interface";
import { uuid } from 'uuidv4';
import path from "path";
import fs from 'fs';
interface UserObject {
  [name: string]: string | number | string[];
 }

let dataBasePath =path.resolve(__dirname,"../balance.json")
let dataBase:UserObject[] = JSON.parse( fs.readFileSync("./balance.json", "utf8") );
console.log(dataBasePath)
let dataTransact:UserObject[] = JSON.parse( fs.readFileSync("./transaction.json", "utf8") );
let tansactData = path.resolve(__dirname,"../transaction.json");



router.get('/', function(req:Request, res:Response, next:NextFunction){
    if(dataBase.length ===0){
    res.status(404).send("account Number not found");
    }else {
      res.status(200).send(dataBase);
    }


  });

router.get('/:accountNo',(req:Request, res:Response,next:NextFunction)=>{
    const disValue = dataBase.find((el:any)=> el.accountNo === req.params.accountNo)
    const valueOfIndex = dataBase.findIndex((el:any)=> el.accountNo === req.params.accountNo)
    if(!disValue){
      res.send("user not available")
    }else{
      res.send(dataBase[valueOfIndex]);
    }
});
router.post('/',function (req:Request, res:Response, next:NextFunction){
    // const id = dataBase.length > 0 ? +dataBase[dataBase.length - 1].accountNo + 1 : 1;
    const {
      accountNo,
      balance
    } = req.body;
    
    const accountPost = {
    accountNo: accountNo,
    balance: balance || 0,
    createdAt: new Date().toISOString()
    };
  
    dataBase.push(accountPost);
    console.log("Write file is about to happen...")
    fs.writeFileSync(dataBasePath, JSON.stringify(dataBase, null, " "));
    res.status(201).send(accountPost);
    
  
});

router.post('/transfer',(req: Request, res: Response)=> {
  const data = req.body;
  console.log(data)
  const { from, to, description, amount } = data;
  if (!from || !to || !description || !amount) {
    return res.status(400).json({
      status: 'fail',
      message: 'input fields required',
    });
    
  }
  if (from === to) {
    return res.status(400).json({
      status: 'fail',
      message: 'invalid parameters',
    });
  }

  const sender = dataBase.find((user) => user.accountNo == from);
  const reciever = dataBase.find((user) => user.accountNo == to);
  if (!sender || !reciever) {
    return res.status(400).json({
      status: 'fail',
      message: 'one of the users does not exist',
    });
    
  }
  if (sender.balance < amount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Insufficient fund',
    });
    
  }
  const newSenderBalance = +sender.balance - amount;
  const newRecieverBalance = +reciever.balance + amount;
  const senderIndex = dataBase.findIndex((user) => user.accountNo === from);
  const recieveIndex = dataBase.findIndex((user) => user.accountNo === to);
  dataBase[senderIndex].balance = newSenderBalance;
  dataBase[recieveIndex].balance = newRecieverBalance;
  fs.writeFile(
    dataBasePath,
    JSON.stringify(dataBase, null, 2),
    (err) => {
      console.log(err);
    },
  );
  const obj: UserObject = {
    reference: uuid(),
    senderAccount: from,
    amount,
    receiverAccount: to,
    transferDescription: description,
    createdAt: new Date().toISOString(),
  };
  dataTransact.push(obj);
  fs.writeFile(
    tansactData ,
    JSON.stringify(dataTransact, null, 2),
    (err) => {
      console.log(err);
    },
  );
  res.status(201).json({
    status: 'success',
    data: {
      transactions: obj,
    },
  });
});

router.get('/transfer/trans',(req: Request, res: Response) => {
  if (dataTransact.length === 0) {
    res.status(404).json({
      status: 'Error',
      data: {
        message: `No transaction found`,
      },
    });
  } else {
    res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      results:  dataTransact.length,
      data: {
        dataTransact,
      },
    });
  }
});
router.get('/transfer/:id',(req: Request, res: Response) => {
  const id = req.params.id;
  const data =  dataTransact.find((el) => el.reference === id);
  if (data) {
    res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      data: {
        data,
      },
    });
  } else {
    res.status(404).json({
      status: 'Error',
      data: {
        message: `Transaction details  not found`,
      },
    });
  }
})







export = router;
import path from "path";
const tester = require("supertest")
const appFolderPath = require("../dist/app").default
let dataBasePath =path.resolve(__dirname,"../../../balance.json")
let data
try{
    data = require(dataBasePath);
} catch(err){
    data = [];
}
describe("To test for getting  data from data balance", () =>{
    test("if data is found", async () => {
        if (data.length >0){
        await tester(appFolderPath)
        .get("/balance")
        .set("Accept", "application/json")
        .expect(200)
        };
    });

    // test("data not found", async () => { 
   
    //    await tester(appFolderPath)
    //     .get("/balance")
    //     .set("Accept", "application/json")
    //     .expect(404)
        
    // });

})


describe("This will test for accounNo", () =>{
    test("post an account", async () =>{
        
        await tester(appFolderPath)
        .post("/balance/transfer")
        .send({
            "from": "0823466909",
            "to": "2823443114",
            "amount": 1000,
            "description": "Trans"
        })
        .set("accept", "application/json")
        .expect(201)

     });
    test("data not found", async () => {
        
        const data = await tester(appFolderPath)
         .post("/")
         .set("Accept", "application/json")
         .expect(404)
         
     });
});



describe("This will test if any user account is not correct", () =>{
    test("post an account", async () =>{
        
        await tester(appFolderPath)
        .post("/balance/transfer")
        .send({
            "from": "0823466909",
            "to": "2823443",
            "amount": 1000,
            "description": "Trans"
        })
        .set("accept", "application/json")
        .expect(400)

     });
    test(" information not found", async () => {
       
        
        const data = await tester(appFolderPath)
         .post("/balance/transfer")
         .send({
            "from": "08234698765443",
            "to": "2823443994",
            "amount": 1000,
            "description": "Trans"

        })
         .set("Accept", "application/json")
         .expect(400)
         
     });
});

describe("This will test for insufficient account", () =>{
    test("post an account", async () =>{
        
        await tester(appFolderPath)
        .post("/balance/transfer")
        .send({
            "from": "08234698765443",
            "to": "2823443994",
            "amount": 1000000,
            "description": "Trans"
        
        })
        .set("accept", "application/json")
        .expect(400)

     });
    test(" information not found", async () => {
       
        
        const data = await tester(appFolderPath)
         .post("/balance/transfer")
         .send({
            "from": "08234698765443",
            "to": "282344399498765",
            "amount": 1000,
            "description": "Trans"

        })
         .set("Accept", "application/json")
         .expect(400)
         
     });
});
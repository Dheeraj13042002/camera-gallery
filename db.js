// 1. Open a DataBase
// 2. Create a ObjectStore
// 3. Make transactions

let db;
let openRequest = indexedDB.open("myDataBase2");

openRequest.addEventListener("success", (e)=>{
    db = openRequest.result;
});
openRequest.addEventListener("error", (e)=>{
    console.log("DB Error");
});
openRequest.addEventListener("upgradeneeded", (e)=>{
    db = openRequest.result;

    db.createObjectStore("video" , { keyPath: "id" });
    db.createObjectStore("image" , { keyPath: "id" });
});
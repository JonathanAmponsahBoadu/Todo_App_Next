import pool from "../../../lib/db";

export  async function GET(req:Request) {
  const user_id =new URL(req.url).searchParams.get("user_id");
    try {
        const result = await pool.query("SELECT * from Tasks_Next where user_id=$1 order by id ASC",[user_id]);
        console.log("Conection successful")

        return Response.json({message:"Tasks obtained",Tasks: result.rows},{status:200});
    } catch (err) {
        return Response.json({message:`Error getting ,${err}`},{status:500})
    }
  }


export  async function POST(
  req: Request,
) {
    const body = await req.json()
    const {task_name,task_type,date,user_id} = body
    if(!task_name){
      return Response.json({message:"Task field required"})
    }
    const required_date = new Date(date).toISOString().split("T")[0];
    try{
      const result1 = await  pool.query("INSERT into Tasks_Next(task_name,task_type,date,user_id) values ($1,$2,$3,$4) returning *",[task_name,task_type,required_date,user_id]);
      return Response.json({message:"Task added",Task:result1.rows[0]},{status:200})
    }
    catch(err){
      return Response.json({message:`Error adding,${err}`},{status:500})
    }
  }


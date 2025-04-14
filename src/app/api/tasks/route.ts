import pool from "../../../lib/db";

export  async function GET() {
    try {
        const result = await pool.query("SELECT * from Tasks_Next");

        return Response.json({message:"Tasks obtained",Tasks: result.rows},{status:200});
    } catch (err) {
        return Response.json({message:`Error getting ,${err}`},{status:500})
    }
  }


export  async function POST(
  req: Request,
) {
    const body = await req.json()
    const {task_name,task_type,date} = body
    if(!task_name){
      return Response.json({message:"Task field required"})
    }
    const required_date = new Date(date).toISOString().split("T")[0];
    try{
      const result1 = await  pool.query("INSERT into Tasks_Next(task_name,task_type,date) values ($1,$2,$3) returning *",[task_name,task_type,required_date]);
      return Response.json({message:"Task added",Task:result1.rows[0]},{status:200})
    }
    catch(err){
      return Response.json({message:`Error adding,${err}`},{status:500})
    }
  }


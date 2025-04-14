import pool from "../../../../lib/db";
export async function DELETE(req: Request) {

    const body = await req.json();
    const {id} = body;
    try {
        const result = await pool.query("DELETE from Tasks_Next where id=$1 returning *",[id]);
        return Response.json({message:"Couldn't find task to delete",Task:result.rows[0]},{status:200})
    }catch(err) {
        return Response.json({message:`Error encountered ${err}`},{status:500})
    }
  }


export async function PUT(
    req:Request
){
    const body = await req.json();
        const {id, iscompleted
        } = body;

        try{

            const result1 = await pool.query("UPDATE Tasks_Next set isCompleted=$1 where id=$2 returning *",[iscompleted,id])
            if (result1.rowCount === 0) {
                return Response.json({ message: "Task not found" }, { status: 404 });
              }
            return Response.json({message:"Task has been updated successfully",Task : result1.rows[0]},{status:200});
    
        }catch(err){
            return Response.json({message:`Error updating task ${err}`},{status:500})
        }
    }

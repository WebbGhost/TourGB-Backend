import { Request,Response } from "express"

export const healthCheck =async  (req:Request, res:Response) => {
  res.status(200).json({
    status:'success',
    data:{
        message:'Hello from server',
    },
  })
}

export const emojiMe =  (req:Request, res:Response) => {
  res.status(200).json({
    status:'success',
    data:{
        hello:'😁',
    },
  })
}
import express from 'express';
import { emojiMe, healthCheck } from '../Controllers/healthCheckController';

const router = express.Router();

type HealthCheckResponse = {
    status:string, 
    data:{
    message:string
    }
};
type EmojiResponse ={
    status:string, 
    data:{
    message:string
    }
    
}

router.get<{}, HealthCheckResponse>('/',healthCheck);
router.get<{}, EmojiResponse>('/emojis',emojiMe)

export default router;
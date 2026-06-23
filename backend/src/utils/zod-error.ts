import {$ZodError} from "zod/v4/core";

export const zodErrorFormat = (error: $ZodError) => {
    const path = error.issues[0].path.join('');
    const message = error.issues[0].message

    if(path && path.length > 0){
        return `${path} - ${message}`
    }
    return  message
}


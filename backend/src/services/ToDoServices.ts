import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/AuthUtils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {ToDoPersistence} from "../persistence/todos/ToDoPersistence";

const uuidv4 = require('uuid/v4');
const toDoPersistence = new ToDoPersistence();

export async function getAllToDoItems(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoPersistence.getAllTodo(userId);
}

export function generateTodoItemUploadUrl(todoId: string, imageId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoPersistence.generateUploadUrl(todoId, imageId, userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return toDoPersistence.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDoItem(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return toDoPersistence.updateToDoByIdAndUsrId(updateTodoRequest, todoId, userId);
}

export function deleteToDoItem(todoId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return toDoPersistence.deleteToDoByIdAndUsrId(todoId, userId);
}
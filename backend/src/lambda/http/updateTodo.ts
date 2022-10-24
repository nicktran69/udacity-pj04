import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {updateToDo} from "../../businessLogic/ToDo";
import {decodeJWTToken} from "../../utils/JWTTokenUtils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Update Event ", event);
    const token = decodeJWTToken(event);
    const id = event.pathParameters.todoId;
    const updateItemsData: UpdateTodoRequest = JSON.parse(event.body);
    const items = await updateToDo(updateItemsData, id, token);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": items
        }),
    }
};

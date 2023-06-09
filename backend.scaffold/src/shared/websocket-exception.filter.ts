import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: WsException | HttpException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient() as WebSocket;
        const data = host.switchToWs().getData();
        const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
        const details = error instanceof Object ? { ...error } : { message: error };
        console.log({
            event: "error",
            data: {
                id: (client as any).id,
                //rid: data.rid,
                ...details
            }
        })
        client.send(JSON.stringify({
            event: "error",
            data: {
                id: (client as any).id,
                //rid: data.rid,
                ...details
            }
        }));
    }
}

/*
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const args = host.getArgs();
        // event ack callback
        if ('function' === typeof args[args.length - 1]) {
            const ACKCallback = args.pop();
            console.log('exception filter', { error: exception.message, exception })
            ACKCallback({ error: exception.message, exception });
        }
    }

}
*/
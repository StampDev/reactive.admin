// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


declare var PubSub;

export module pubsub {

    export const BROADCAST: string = 'BROADCAST'


    export function subscribe(topic: string, callback: (msg?: any, data?: any) => any): number {

        return PubSub.subscribe(topic, callback);
    }


    export function publish(topic: string, data?: any) {
        return PubSub.publish(topic, data);
    }

}


export module local {


    var local: any = $['localStorage'];


    export function set(name: string, obj: any) {
        local.set(name, obj);
    }


    export function get(name: string) {

        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        var obj: any = local.get(name);

        if (obj) {

            if (isJson(obj)) {

                obj = JSON.parse(obj);
            }
        }

        return obj;
    }


    export function remove(name: string) {
        return local.remove(name);
    }
}
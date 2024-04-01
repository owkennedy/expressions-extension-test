import {Expressions} from "./Expressions.tsx";
import {useEffect, useState} from "react";
import {Extension, InitialData} from "chub-extensions-ts";
import InitData from './assets/test-init.json';

export interface TestExtensionRunnerProps<ExtensionType extends Extension<StateType, ConfigType>, StateType, ConfigType> {
    factory: (data: InitialData<StateType, ConfigType>) => ExtensionType;
}

export const TestExtensionRunner = <ExtensionType extends Extension<StateType, ConfigType>,
    StateType, ConfigType>({ factory }: TestExtensionRunnerProps<ExtensionType, StateType, ConfigType>) => {

    // @ts-ignore the linter doesn't like the idea of reading the imaginary Emotion type arbitrarily from strings
    const [extension, _setExtension] = useState(new Expressions(InitData));

    // This is what forces the node to re-render.
    const [node, setNode] = useState(new Date());

    useEffect(() => {
        extension.load().then((res) => {
            console.info(`Test Extension Runner load success result was ${res.success}`);
            if(!res.success || res.error != null) {
                console.error(`Error from extension during load, error: ${res.error}`);
            }
            extension.afterResponse({
                anonymizedId: "2",
                content: "Checking what happens if sent messages for a bot without a pack.",
                isBot: true}).then(() => setNode(new Date()));
            extension.afterResponse({
                anonymizedId: "1",
                content: "I'm so confused. I don't understand. What? Why? How?",
                isBot: true
            }).then(() => setNode(new Date()));
            (new Promise(f => setTimeout(f, 5000))).then(() => {
                extension.setState({'1': 'embarrassment', '2': 'excitement', '3': 'love'}).then(() => setNode(new Date()));
            });
        });
    }, []);

    return <>
        <div style={{display: 'none'}}>{String(node)}{window.location.href}</div>
        {extension == null ? <div>Extension loading...</div> : extension.render()}
    </>;
}

import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import SsmlToolbar from './modules/ssmlToolbar';
import { Buffer } from 'buffer';

const state = {
    elements: {
        editor: null,
        toolbar: null,
        wrapper: null,
    },
    modules: {
        editor: {
            id: 'ssmlEditor-editor',
        },
    },
    quill: null,
};

/**
 * Registers a new Quill editor instance.
 * @param {*} container
 * @param {*} quillOptions
 * @returns A quill instance.
 */
export function run(container, quillOptions) {
    const options = quillOptions || {
        debug: 'warn',
        modules: {
            toolbar: {
                container: [
                    [{ ssml_break: ['250ms', '500ms', '750ms', '1s'] }],
                    ['ssml_emphasis'],
                    [{ ssml_gender: ['Female', 'Male', 'Neutral'] }],
                    [{ ssml_language: ['en-US', 'en-GB', 'de-DE', 'es-ES', 'fr-FR', 'it-IT', 'nl-NL', 'ru-RU', 'tr-TR'] }],
                    [{ ssml_sayas: ['spell-out', 'number', 'ordinal', 'digits', 'fraction', 'expletive'] }],
                    [{ ssml_date: ['mdy', 'dmy', 'ymd', 'md', 'dm', 'ym', 'my', 'd', 'm', 'y'] }],
                    ['ssml_substitute'],
                    ['ssml_phoneme'],
                    [{ ssml_prosody: ['25%', '50%', '75%', '100%', '125%'] }],
                    ['ssml_validate'],
                ],
                handlers: {
                    ssml_break: function () {},
                    ssml_emphasis: function () {},
                    ssml_gender: function () {},
                    ssml_language: function () {},
                    ssml_sayas: function () {},
                    ssml_date: function () {},
                    ssml_substitute: function () {},
                    ssml_phoneme: function () {},
                    ssml_prosody: function () {},
                    ssml_validate: function () {},
                },
            },
            ssmlToolbar: true,
        },
        placeholder: '',
        theme: 'snow',
    };

    setupDOMContainers(container);

    if (!state.quill) {
        Quill.register({
            'modules/ssmlToolbar': SsmlToolbar,
        });
    }

    state.quill = new Quill(state.elements.editor, options);
    state.quill.setText('<speak version="1.1" xml:lang="en-US">\n\n</speak>');
    state.quill.setSelection(39, 0);

    return state.quill;
}

/**
 * Appends the Quill editor into a container.
 * @param {*} container
 */
function setupDOMContainers(container) {
    const elEditor = document.createElement('div');
    const elHostpageWrapper = typeof container === 'string' ? document.getElementById(container) : container;

    elEditor.setAttribute('id', state.modules.editor.id);

    state.elements.editor = elEditor;
    state.elements.wrapper = elHostpageWrapper;

    if (elHostpageWrapper instanceof HTMLElement) {
        elHostpageWrapper.appendChild(elEditor);
    } else {
        console.error('Trouble finding the editor wrapper. Pass an `id` (no hash) or a DOM element.');
    }
}

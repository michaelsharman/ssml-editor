import Quill from 'quill/core/quill';
import * as ssmlCheck from '@caspingus/ssml-check';

const Module = Quill.import('core/module');

class SsmlToolbar extends Module {
    constructor(quill, options) {
        super(quill, options);

        this.controls = [];
        this.handlers = {};
        this.options = options;
        this.quill = quill;

        this.loadIcons();
        this.registerHandlers();
    }

    /**
     * Load icons to use for toolbar buttons
     */
    loadIcons() {
        const fileref = document.createElement('link');

        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
        document.getElementsByTagName('head')[0].appendChild(fileref);
    }

    /**
     * Sets up all toolbar button handlers
     * @param {object} quill
     */
    registerHandlers() {
        const toolbar = this.quill.getModule('toolbar');

        setToolbarIcons();

        toolbar.addHandler('ssml_break', pause.bind(this));
        toolbar.addHandler('ssml_emphasis', emphasis.bind(this));
        toolbar.addHandler('ssml_gender', gender.bind(this));
        toolbar.addHandler('ssml_language', language.bind(this));
        toolbar.addHandler('ssml_sayas', sayas.bind(this));
        toolbar.addHandler('ssml_date', date.bind(this));
        toolbar.addHandler('ssml_substitute', substitute.bind(this));
        toolbar.addHandler('ssml_phoneme', phoneme.bind(this));
        toolbar.addHandler('ssml_prosody', prosody.bind(this));
        toolbar.addHandler('ssml_validate', validate.bind(this));

        /**
         * Loads the icons for the toolbar and the data for dropdowns
         */
        function setToolbarIcons() {
            document.querySelector('.ql-ssml_phoneme').innerHTML = '<span class="material-symbols-outlined" title="Phoneme">menu_book</span>';
            document.querySelector('.ql-ssml_validate').innerHTML = '<span class="material-symbols-outlined" title="Validate SSML">domain_verification</span>';
            document.querySelector('.ql-ssml_emphasis').innerHTML = '<span class="material-symbols-outlined" title="Emphasis">Highlight</span>';
            document.querySelector('.ql-ssml_substitute').innerHTML = '<span class="material-symbols-outlined" title="Substitute">letter_switch</span>';

            const breakPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_break .ql-picker-item'));
            breakPickerItems.forEach(item => (item.textContent = item.dataset.value));
            document.querySelector('.ql-ssml_break .ql-picker-label').innerHTML =
                '<span class="material-symbols-outlined" title="Break">auto_read_pause</span>' +
                document.querySelector('.ql-ssml_break .ql-picker-label').innerHTML;

            const genderPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_gender .ql-picker-item'));
            genderPickerItems.forEach(item => (item.textContent = item.dataset.value));
            document.querySelector('.ql-ssml_gender .ql-picker-label').innerHTML =
                '<span class="material-symbols-outlined" title="Gender">Wc</span>' + document.querySelector('.ql-ssml_gender .ql-picker-label').innerHTML;

            const languagePickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_language .ql-picker-item'));
            languagePickerItems.forEach(item => (item.textContent = item.dataset.value));
            document.querySelector('.ql-ssml_language .ql-picker-label').innerHTML =
                '<span class="material-symbols-outlined" title="Language">Language</span>' +
                document.querySelector('.ql-ssml_language .ql-picker-label').innerHTML;

            const sayasPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_sayas .ql-picker-item'));
            sayasPickerItems.forEach(item => (item.textContent = item.dataset.value));
            document.querySelector('.ql-ssml_sayas .ql-picker-label').innerHTML =
                '<span class="material-symbols-outlined" title="Say as">translate</span>' + document.querySelector('.ql-ssml_sayas .ql-picker-label').innerHTML;

            const prosodyItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_prosody .ql-picker-item'));
            prosodyItems.forEach(item => (item.textContent = item.dataset.value));
            document.querySelector('.ql-ssml_prosody .ql-picker-label').innerHTML =
                '<span class="material-symbols-outlined" title="Prosody">speed</span>' + document.querySelector('.ql-ssml_prosody .ql-picker-label').innerHTML;

            const datePickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_date .ql-picker-item'));
            datePickerItems.forEach(item => (item.textContent = item.dataset.value));
            document.querySelector('.ql-ssml_date .ql-picker-label').innerHTML =
                '<span class="material-symbols-outlined" title="Date">calendar_month</span>' +
                document.querySelector('.ql-ssml_date .ql-picker-label').innerHTML;
        }

        function date(value) {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</say-as>');
                    this.quill.insertText(range.index, '<say-as interpret-as="date" format="' + value + '">');
                    this.quill.setSelection(range.index + range.length + value.length + 47);
                }
            } else {
                this.quill.insertText('<say-as interpret-as="date" format=""></say-as>');
            }
        }

        function emphasis() {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</emphasis>');
                    this.quill.insertText(range.index, '<emphasis level="strong">');
                    this.quill.setSelection(range.index + range.length + 36);
                }
            } else {
                this.quill.insertText('<emphasis level="strong"></emphasis>');
            }
        }

        function gender(value) {
            const range = quill.getSelection();

            this.quill.insertText(range.index + range.length, '</voice>');
            this.quill.insertText(range.index, '<voice gender="' + value + '">');
            this.quill.setSelection(range.index + range.length + value.length + 25);
        }

        function lineBreaks(value) {
            const text = quill.getText();
            quill.setText(this.processLineBreaks(text));
        }

        function language(value) {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</lang>');
                    this.quill.insertText(range.index, '<lang xml:lang="' + value + '">');
                    this.quill.setSelection(range.index + range.length + value.length + 25);
                }
            } else {
                this.quill.insertText('<lang xml:lang=""></lang>');
            }
        }

        function prosody(value) {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</prosody>');
                    this.quill.insertText(range.index, '<prosody rate="' + value + '">');
                    this.quill.setSelection(range.index + range.length + value.length + 25);
                }
            } else {
                this.quill.insertText('<prosody rate=""></prosody>');
            }
        }

        function pause(value) {
            if (value) {
                const cursorPosition = this.quill.getSelection().index;

                this.quill.insertText(cursorPosition, '<break time="' + value + '"/>');
                this.quill.setSelection(cursorPosition + value.length + 20);
            }
        }

        function phoneme() {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</phoneme>');
                    this.quill.insertText(range.index, '<phoneme alphabet="ipa" ph="pɪˈkɑːn">');
                    this.quill.setSelection(range.index + range.length + 46);
                }
            }
        }

        function sayas(value) {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</say-as>');
                    this.quill.insertText(range.index, '<say-as interpret-as="' + value + '">');
                    this.quill.setSelection(range.index + range.length + value.length + 33);
                }
            } else {
                this.quill.insertText('<say-as interpret-as=""></say-as>');
            }
        }

        function speak() {
            const contents = this.quill.getText();
            const regex = /<speak\b[^>]*>(.*?)<\/speak>/s;
            const match = contents.match(regex);

            if (!match) {
                this.quill.setText(`<speak version="1.1" xml:lang="en-US">${contents}</speak>\n`, 'user');
            }
        }

        function substitute() {
            const range = quill.getSelection();

            if (range) {
                if (range.length > 0) {
                    this.quill.insertText(range.index + range.length, '</sub>');
                    this.quill.insertText(range.index, '<sub alias="Enter Substitute Text Here">');
                    this.quill.setSelection(range.index + range.length + 46);
                }
            }
        }

        function validate() {
            ssmlCheck.check(quill.getText()).then(errors => {
                const validIcon = `<span class="material-symbols-outlined" title="Valid">check_circle</span>`;
                const invalidIcon = `<span class="material-symbols-outlined" title="Invalid">error</span>`;
                const elStatus = document.getElementById('ssmlStatus');

                elStatus.innerHTML = '';
                elStatus.classList.remove('hidden');

                console.log(errors);
                if (errors) {
                    ssmlCheck.verifyAndFix(quill.getText()).then(result => {
                        if (result.fixedSSML) {
                            console.log(result.fixedSSML);
                        } else if (result.errors) {
                            let msg = '';
                            elStatus.classList.remove('ssmlStatusValid');
                            elStatus.classList.add('ssmlStatusInvalid');
                            if (result.errors[0]?.tag === 'speak') {
                                msg = '. Check body is encased within a &lt;speak&gt;&lt;/speak&gt; element.';
                            }
                            elStatus.innerHTML = `${invalidIcon} Invalid SSML${msg}`;
                            console.log(JSON.stringify(result.errors));
                        }
                    });
                } else {
                    elStatus.classList.remove('ssmlStatusInvalid');
                    elStatus.classList.add('ssmlStatusValid');
                    elStatus.innerHTML = `${validIcon} Valid SSML`;
                }
            });
        }
    }

    processBlankLines(inputString) {
        // Trim the input to remove leading/trailing newlines
        inputString = inputString.trim();

        // Split the input into paragraphs by double newlines
        const paragraphs = inputString.split(/\n\n/);

        // Process each paragraph
        const formattedParagraphs = paragraphs.map(paragraph => {
            // Trim each paragraph to remove leading/trailing newlines
            paragraph = paragraph.trim();

            // Split the paragraph into sentences. This regex splits on a period followed by a space or the end of the string.
            const sentences = paragraph.split(/(?<=\.)\s+/);

            // Wrap each sentence with <s></s> tags
            const wrappedSentences = sentences.map(sentence => `<s>${sentence}</s>`);

            // Join the sentences back together, and wrap the entire paragraph with <p></p> tags
            return `<p>${wrappedSentences.join('')}</p>`;
        });

        // Join all paragraphs back together to form the final string
        return formattedParagraphs.join('');
    }

    processLineBreaks(ssmlString) {
        // Initialize DOMParser
        const parser = new DOMParser();
        const serializer = new XMLSerializer();

        // Parse the SSML string into a DOM object
        const doc = parser.parseFromString(ssmlString, 'text/xml');

        // Find the <speak> element
        const speakElement = doc.querySelector('speak');

        if (speakElement) {
            // Extract the text content inside <speak>
            const speakContent = speakElement.textContent;

            // Process the content
            const formattedContent = this.processBlankLines(speakContent);

            // Update the <speak> element with the formatted content
            // Clear the current content
            while (speakElement.firstChild) {
                speakElement.removeChild(speakElement.firstChild);
            }

            // Parse the formatted content back into DOM nodes and append them to <speak>
            const formattedDoc = parser.parseFromString(`<speak>${formattedContent}</speak>`, 'text/xml').documentElement;
            Array.from(formattedDoc.childNodes).forEach(node => {
                speakElement.appendChild(doc.importNode(node, true));
            });
        }

        // Serialize the DOM back to a string
        return serializer.serializeToString(doc);
    }
}

SsmlToolbar.DEFAULTS = {};

export { SsmlToolbar as default };

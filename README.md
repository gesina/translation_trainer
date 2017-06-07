# Translation Trainer

These are the sources for a translation assistant website which was
the final project during a HTML5 and CSS3 course at the university of
Regensburg in 2014/2015.

## Motivation
The Translation Trainer is intended to be a little assistant for
those who like reading texts in foreign languages but still have
problems with the vocabulary.
The main idea is to ensure that looking up words in a dictionary or
googling them interrupts the studies of the text.
One will (hopefully) find this intention reflected in the rather
simple than overloaded or distracting design made mainly for
reader-friendly screen-sizes and in eye-resting brightness.

The Page is based on AJAX-queries
to [Glosbe-Dictionary][https://glosbe.com/], the only
really working and large enough free online dictionary with 
AJAX-support I could find at that time. Check it out at
https://glosbe.com/

Feel free to contact me if you have any suggestions for
improvement/new features.

## Code Structure
Code as well as page are roughly structured in
(for usage see the detailed description in the corresponding section
of the HTML-document):

### Input
1. text input:
   - elements: text input field, button "GO"
   - text extraction:
	 * splitting input text in sections of MAX_PARLENGTH=2000 (split_str)
	 * save sections in sessionStorage (store_par)
	 * create next visible section (create_output):
	   extracts via Regular Expressions every word out of the
	   given text, puts it into a `<span>` and this into a `<div>` with 
	   class `word_div`; no word characters are inserted
	   inbetween;
2. file extraction:
   - elements: input type file, button "Load"
   -  first gets the text via FileReader obj:
	  * recursively reads all files in the input-list
	  * rest same as above
3. language selection:
   - elements: seletion tags in the navigation bar and two text inputs
   - individual language select is possible through option "type
	 ..." which triggers the correspondent input field to
   	 show; input has to be the corresponding ISO 639-3 language code;
   	 (langfrom, langto);

### Translation Output (for translation bar on the left and the words):
1. init of translation `<div>` for touched word:
   - creation only on first touch or if language has changed
	 (`init_transl`, `create_transl`)
2. AJAX-query for word the cursor touched:
   - generate needed settings (`settings`, `get_data_Glosbe`,
   within `button_transl00`-event)
   - send to Glosbe-Dictionary
3. interpretation (interpret_data_Glosbe):
   - workaround for Glosbe's case sensitivity
   - picking of every given translation with examples and
	 descriptions:
	 * create list element with click-binding to being
	   added to vocab sheet	
     * each in one `<li>` and this in the translation list;
	 * if none available giving warning;
4. display:
   - display dependend on cursor position:
	 * above half of word: container above
	 * below half of word: container below

### Vocabulary List
1. input:
   - from every word-translation-container (also the one on the
   left) by clicking translation
   - from alternative input field in word-translation-containern
   (individual translations for given word)
   - from alternative input under "Vocab"
   (individual entry, also notes)
2. deletion:
   - individually: *X*-button in `voc_div`
   - all: *clear all*-button
3. HTML-download:
   - creation of the text for the new HTML-file (without JavaScript)
	 (`download_html_style`, `html_prefix`, `html_suffix`, `vocab_to_html`)
   - download via URI-encoded link (`create_vocab_download`)

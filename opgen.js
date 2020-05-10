// opgen is short for one-page-generator
'use strict';
import * as Templates from './templates/index.js';

const MDinput          = document.querySelector('.MDinput');
const TemplateSelector = document.querySelector('.TemplateSelector');
const Generating       = document.querySelector('.Generating');
const Preview          = document.querySelector('.Preview');
const Result           = document.querySelector('.Result');


export function listenToGeneratingEvents(){
    // MDinput.addEventListener('change', ()=>{
    //     text = Mdinput.value;
    // });

    // TemplateSelector.addEventListener('change', ()=>{
    //     template = TemplateSelector.value;
    // });

    Generating.addEventListener('click', ()=>{
        let text = MDinput.value;
        let template_name = TemplateSelector.value;
        
        let skeleton = Templates.skeleton;
        let div_body = Templates[template_name].div_body;
        div_body = div_body.split('a_very_long_word');
        div_body = div_body[0] + text + div_body[1];
        skeleton = skeleton.split('a_very_magical_word');
        skeleton = skeleton[0] + div_body + skeleton[1];
        console.log(div_body);
        console.log(skeleton);
        Preview.innerHTML = div_body;
        Result.value = skeleton;
    });
}
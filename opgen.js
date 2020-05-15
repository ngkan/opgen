// opgen is short for one-page-generator
'use strict';
import * as Templates from './templates/index.js';

const head             = document.querySelector('head')
const MDinput          = document.querySelector('.MDinput');
const TemplateSelector = document.querySelector('.TemplateSelector');
const Generating       = document.querySelector('.Generating');
const Preview          = document.querySelector('.Preview');
const Result           = document.querySelector('.Result');

export function listenToGeneratingEvents(){
    Generating.addEventListener('click', ()=>{
        let text = MDinput.value;
        let template_name = TemplateSelector.value;
        
        add_preview_css_script(template_name);
        
        let actualhtml = '';
        let previewhtml = Templates[template_name].div_body_top
        + markdown_string_to_html_string(text)
        + Templates[template_name].div_body_bot;
        
        markdown_string_to_html_string(text);

        // Put preview on the website
        Preview.innerHTML = previewhtml;
        // Result.value = skeleton;
    });
}

const PREVIEW_CSS_SCRIPT = 'preview_css_script';
function add_preview_css_script(template){
    remove_preview_css_script();

    let preview_css = document.createElement('link');
    preview_css.id = PREVIEW_CSS_SCRIPT;
    preview_css.href = 'templates/' + template + '/styles.css';
    preview_css.type = 'text/css';
    preview_css.rel = 'stylesheet';
    head.appendChild(preview_css);
}
function remove_preview_css_script(){
    let preview_css = document.querySelector('#' + PREVIEW_CSS_SCRIPT);
    if (preview_css != null){
        head.removeChild(preview_css);
    }
}

function markdown_string_to_html_string(markdown_string){
    let lines = markdown_string.split('\n');

    let result = ''; 

    for (let i = 0; i < lines.length; i++){
        /* Rules:
            horizontal rules
            codes
            images
            links
            heading
            escaping character
        */
        // check horizontal rules
        lines[i] = check_horizontal_rules(lines[i]);

        // check images
        lines[i] = check_image(lines[i]);
       
        // check links
        lines[i] = check_link(lines[i]);

        // check if heading
        lines[i] = check_heading(lines[i]);
        
        // check escaping character
        lines[i] = check_escaping_character(lines[i]);

        result += lines[i];
    }
    return result;
}
function check_horizontal_rules(str){
    if (str.length < 3)
        return str;
    if (str[0] != '*' && str[0] != '-' && str[0] != '_')
        return str;
    for(let i=1;i<str.length;i++)
        if (str[0] != str[i])
            return str;
    return '<hr>';
}
function check_if_heading(str){
    for (let i = 6; i >= 1; i --){
        let x = '';
        for(let j = 0; j < i; j ++) x += '#';
        x += ' ';

        if (str.length >= i+1 && str.slice(0,i+1) == x)
            return i; 
    }

    return 0;
}
function check_image(str){
    // pattern = ![ ]()
    let link_pattern = /!\[([^\]]*)\]\(([^\)\"]*)\)/g;
    let p;

    let tmp = str.split(/!\[[^\]]*\]\([^\)]*\)/);
    console.log('img');
    console.log(tmp);
    let res = '';
    let i = 0;

    do{
        res += tmp[i];
        i++;

        p = link_pattern.exec(str);
        console.log(p);
        if (p){
            res += `<img src="${p[2]}" alt="${p[1]}">`;
        }

    } while(p);

    return res;
}
function check_link(str){
    // pattern = [ ]()
    let link_pattern = /\[([^\]]*)\]\(([^\)\"]*)\)/g;
    let p;

    // cant use () brackets here (?)
    // https://stackoverflow.com/a/17516064
    let tmp = str.split(/\[[^\]]*\]\([^\)]*\)/);
    console.log(tmp);
    let res = '';
    let i = 0;

    do{
        res += tmp[i];
        i++;

        p = link_pattern.exec(str);
        console.log(p);
        if (p){
            res += `<a href="${p[2]}">${p[1]}</a>`;
        }

    } while(p);

    return res;
}
function check_heading(str){
    let heading_size = check_if_heading(str);
    let result = '';

    if (heading_size == 0)
        result += '<p>' + str + '</p>';
    else{
        let x = '';
        for(let j = 0; j < heading_size; j ++) x += '#';
        x += ' ';

        console.log(str);
        str = str.replace(x, '');
        console.log(str);
        result += '<h' + heading_size + '>' + str + '</h' + heading_size + '>';
    }

    return result;
}
function check_escaping_character(str){
    // pattern = \[+-\ ...]
    let link_pattern = /\\([\\`\*-\_\{\}\[\]\(\)#\+\.!\|])/g;
    let p;

    // cant use () brackets here (?)
    // https://stackoverflow.com/a/17516064
    let tmp = str.split(/\\[\\`\*-\_\{\}\[\]\(\)#\+\.!\|]/);
    console.log(tmp);
    let res = '';
    let i = 0;

    do{
        res += tmp[i];
        i++;

        p = link_pattern.exec(str);
        console.log(p);
        if (p){
            res += p[1];
        }

    } while(p);

    return res;
}
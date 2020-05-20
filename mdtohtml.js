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
    let res = '';
    let i = 0;

    do{
        res += tmp[i];
        i++;

        p = link_pattern.exec(str);
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
    let res = '';
    let i = 0;

    do{
        res += tmp[i];
        i++;

        p = link_pattern.exec(str);
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

        str = str.replace(x, '');
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
    let res = '';
    let i = 0;

    do{
        res += tmp[i];
        i++;

        p = link_pattern.exec(str);
        if (p){
            res += p[1];
        }

    } while(p);

    return res;
}

export function markdown_text_to_html(markdown_text){
    let lines = markdown_text.split('\n');

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

function undefined_to_empty_string(p){
    for (let i=0;i<p.length;i++){
        if (!p[i])
            p[i] = '';
    }
}
export function md_to_html(md){
/*  Dont support referrences yet

Structure:
    Main:
        Group 1: the characters before the regex match: (.*?)
        Group 2: the characters in the regex match
        ([\s\S]*?)((a) | (b) | (c) | ....)

    Span    
        Link:
            Group 3: (\[([^\]]*)\]\(([^"]*)("[^"]*"){0,1}\))
            Group 4: text
            Group 5: link
            Group 6: title

        Image:
            Group 7: (!\[([^\]]*)\]\(([^"]*)("[^"]*"){0,1}\))
            Group 8: text
            Group 9: link
            Group 10: title

        Emphasis
            Group 11: (\*\*(\w.*\w|\w)\*\*|\*(\w.*\w|\w)\*|__(\w.*\w|\w)__|_(\w.*\w|\w)_)
            Group 13: *single asterisks*      3
            Group 15: _single underscores_    5
            Group 12: **double asterisks**    2
            Group 14: __double underscores__  4

        Code
            Group 16: (`{2,}(.+)`{2,}|`(.+)`)
            Group 17: At least than 2 backticks
            Group 18: One backtick

    Miscellaneous
        Automatic Links
            Group 19: (<(.+)>)
            Group 20: the link

        Backslash Escapes
            Group 21: (\\([\\`\*-\_\{\}\[\]\(\)#\+\.!\|]))
            Group 22: the character
    
    Block Elements
        Setext-style header
            Group 23: (^([^\n]*)\n=+\n|^([^\n]*)\n=+$|\n([^\n]*)\n=+\n+|\n*([^\n]*)\n=+$)
            Group 24-27: text H1

            Group 28: (^([^\n]*)\n-+\n|^([^\n]*)\n-+$|\n([^\n]*)\n-+\n+|\n*([^\n]*)\n-+$)
            Group 29-32: text H2

        Atx-style header
            Group 33: ((#{1,6}) ([^\n]*))
            Group 34: n0 of # 
            Group 35: header
    
    break
        group 36: (\n)
    //Any: group 36 .*
        //Unordered lists:
        //    Group 36: ((^|\n)([*+-](.+)$|[*+-](.+)\n){1,})
        //    Group 37,38,39,40: ?
        
*/
    let pattern = /([\s\S]*?)((\[([^\]]*)\]\(([^"]*)("[^"]*"){0,1}\))|(!\[([^\]]*)\]\(([^"]*)("[^"]*"){0,1}\))|(\*\*(\w.*\w|\w)\*\*|\*(\w.*\w|\w)\*|__(\w.*\w|\w)__|_(\w.*\w|\w)_)|(`{2,}(.+)`{2,}|`(.+)`)|(<(.+)>)|(\\([\\`\*-\_\{\}\[\]\(\)#\+\.!\|]))|(^([^\n]*)\n=+\n|^([^\n]*)\n=+$|\n([^\n]*)\n=+\n|\n([^\n]*)\n=+$)|(^([^\n]*)\n-+\n|^([^\n]*)\n-+$|\n([^\n]*)\n-+\n|\n([^\n]*)\n-+$)|((#{1,6}) ([^\n]*))|(\n))/g;
    /*
    (.*?)
    (
        (\[([^\]]*)\]\(([^"]*)("[^"]*"){0,1}\))
        |(!\[([^\]]*)\]\(([^"]*)("[^"]*"){0,1}\))
        |((\*\w.*\w\*|\*\w\*)|(\*\*\w.*\w\*\*|\*\*\w\*\*)|(_\w.*\w_|_\w_)|(__\w.*\w__|__\w__))
        |(`{2,}(.+)`{2,}|`(.+)`)
        |(<(.+)>)
        |(\\([\\`\*-\_\{\}\[\]\(\)#\+\.!\|]))
        |(^([^\n]*)\n=+\n|^([^\n]*)\n=+$|\n([^\n]*)\n=+\n|\n([^\n]*)\n=+$)
        |(^([^\n]*)\n-+\n|^([^\n]*)\n-+$|\n([^\n]*)\n-+\n|\n([^\n]*)\n-+$)
        |((#{1,6})([^\n]*))
        |((^|\n)([*+-](.+)$|[*+-](.+)\n){1,})
    )/g;
    */
    
    let p, res = '';
    let last = -1;

    console.log(md);
    do{
        p = pattern.exec(md);
        
        console.log(p);
        console.log(last);
        console.log(md.substring(0,last));
        if (p){
            last = p.index;
            res += p[1];

            // link
            if (p[3]){
                undefined_to_empty_string(p);
                res += `<a href="${p[5]}" title="${p[6]}">${p[4]}</a>`;
            }
            // image
            else if (p[7]){
                undefined_to_empty_string(p);
                res += `<img src="${p[9]}" title = "${p[10]}" alt="${p[8]}">`;
            }
            // emphasis
            else if (p[13] || p[15]){
                undefined_to_empty_string(p);
                res += `<em>${p[13]+p[15]}</em>`;
            }
            else if (p[12] || p[14]){
                undefined_to_empty_string(p);
                res += `<strong>${p[12]+p[14]}</strong>`;
            }
            // code
            else if (p[16]){
                undefined_to_empty_string(p);
                res += `<code>${p[17]+p[18]}</code>`;
            }
            // auto link
            else if (p[19]){
                undefined_to_empty_string(p);
                res += `<a href="${p[20]}">${p[20]}</a>`;
            }
            // escape char
            else if (p[21]){
                undefined_to_empty_string(p);
                res += p[22];
            }
            // h1
            else if (p[23]){
                undefined_to_empty_string(p);
                res += `<h1>${p[24]+p[25]+p[26]+p[27]}</h1>`;
            }
            // h2
            else if (p[28]){
                undefined_to_empty_string(p);
                res += `<h2>${p[29]+p[30]+p[31]+p[32]}</h2>`;
            }
            // h1-6
            else if (p[33]){
                undefined_to_empty_string(p);
                let sz = p[34].length;
                res += `<h${sz}>${p[35]}</h${sz}>`;
            }
            else if (p[36]){
                res += '<br>';
            }
        }

    } while(p);
    
    return res + md.substring(last,md.length);
}

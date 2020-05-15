"""
Convert a HTML / CSS / any type of files to a string and replacing
newline characters ('\n') with backslash ('\').
"""

print('This program can only convert files in the same folder')
print('... and also create a file consist the result in the same folder.')
print('Name of the file:')

file_name = str(input())

with open(file_name, 'r') as file:
    data = file.read() #.replace('\n', '\\')
    out = ''
    for c in data:
        if c == '\n':
            out += '\\\n'
        else:
            out += c
    
    with open(file_name + '.js', 'w') as output:
        output.write('\'' + out + '\'')

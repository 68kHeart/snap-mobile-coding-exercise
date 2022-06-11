# RPN Calculator — CLI Program and Library

## Description

This is both a command line REPL program for performing calculations using reverse Polish notation, in addition to a library for enabling the creation of such programs. It supports addition, subtraction, multiplication, and division.

### Compiling

1. `npm install`  
   Install required tools and libraries
2. `make`  
   Compile the script
3. `node ./build/rpn-calc.js`  
   Run the script

### Usage

You will be presented with a prompt like so

    node ./build/rpn-calc.js
    >

You type a list of operations separated by spaces that affects an ongoing stack of numbers the program keeps track of. You can either type a number, whole or decimal fraction, to push directly on the stack or perform an operation on the two top-most values. Operations are performed as `n • m`, where `m` is the most recent value put on the stack and `n` is the second most recent value. The supported mathematical operations are:

Operation      | Symbol | Example
---------------|--------|--------------
Addition       | `+`    | `6 2 + == 8`
Subtraction    | `-`    | `6 2 - == 4`
Multiplication | `*`    | `6 2 * == 12`
Division       | `/`    | `6 2 / == 3`

When you are finished, you can type `Control + C` or `Control + D` to exit the program.

## Design and Architecture

The program follows a simple REPL architecture: reading input, parsing the input into valid operations, evaluating the operations, and then printing the result before looping back to reading again.

<svg viewBox="0 0 256 176">
  <path id="background" fill="#fff" d="M0 0h256v176H0z"/>
  <g role="image" id="program">
    <title>The program, which handles reading input and printing output</title>
    <path id="program-background" fill="#cbbbe9" d="M8 24h112v144H8z"/>
    <path id="program-title" fill="#250657" d="M33.453 7.801v11.2h1.92V14.76h2.736c2.688 0 3.76-1.888 3.76-3.488 0-1.712-.976-3.471-3.76-3.471zm1.92 1.822h2.832c1.312 0 1.68.945 1.68 1.649 0 .784-.448 1.664-1.68 1.664h-2.832zm11.66 1.01c-.816 0-1.36.367-1.68 1.04v-.849H43.48V19h1.874v-4.576c0-1.552.815-1.951 1.535-1.951.624 0 1.056.192 1.392.432l.272-1.713a2.276 2.276 0 0 0-1.52-.559zm6.197 0c-2.288 0-3.744 1.615-3.744 4.287 0 2.688 1.456 4.272 3.744 4.272 2.304 0 3.76-1.584 3.76-4.272 0-2.672-1.456-4.287-3.76-4.287zm8.743 0c-2 0-3.393 1.6-3.393 4.272 0 2.848 1.457 4.287 3.377 4.287.736 0 1.375-.209 1.855-.737v.465c0 1.104-.672 1.616-2.976 1.776l.992 1.503c2.816-.208 3.858-1.311 3.858-4.015v-7.36h-1.874v.497c-.383-.384-.991-.688-1.84-.688zm9.654 0c-.816 0-1.36.367-1.68 1.04v-.849h-1.873V19h1.873v-4.576c0-1.552.815-1.951 1.535-1.951.624 0 1.057.192 1.393.432l.271-1.713a2.276 2.276 0 0 0-1.519-.559zm5.977 0c-1.376 0-2.464.399-3.2.895l.576 1.521c.688-.48 1.44-.77 2.432-.77 1.072 0 1.6.417 1.6 1.489v.431c-.512-.288-1.168-.431-1.936-.431-1.616 0-3.201.817-3.201 2.705 0 1.792 1.28 2.719 2.96 2.719 1.089 0 1.777-.432 2.177-.848V19h1.824v-5.263c0-2.752-1.792-3.104-3.232-3.104zm9.343 0c-.848 0-1.536.32-2 .943v-.752h-1.873V19h1.873v-4.656c0-1.312.607-1.936 1.535-1.936.96 0 1.393.625 1.393 1.905V19h1.871v-4.656c0-1.312.593-1.936 1.537-1.936.96 0 1.39.625 1.39 1.905V19h1.874v-5.217c0-2.304-1.296-3.15-2.992-3.15-1.056 0-1.921.35-2.465 1.15-.432-.784-1.167-1.15-2.143-1.15zM53.23 12.408c1.168 0 1.89.96 1.89 2.512s-.722 2.48-1.89 2.48c-1.136 0-1.87-.928-1.87-2.48s.734-2.512 1.87-2.512zm9.047 0c.72 0 1.247.383 1.535.8V16.6c-.335.512-.863.8-1.535.8-1.168 0-1.824-.991-1.824-2.495 0-1.616.656-2.497 1.824-2.497zm15.102 2.96c.608 0 1.2.127 1.633.335v1.057a2.489 2.489 0 0 1-1.825.785c-.975 0-1.488-.432-1.488-1.072 0-.784.752-1.106 1.68-1.106z"/>
  </g>
  <g role="image" id="library">
    <title>The library, which handles parsing input and evaluating operations</title>
    <path id="library-background" fill="#cbbbe9" d="M136 24h112v144H136z"/>
    <path id="library-title" fill="#250657" d="M181.488 7.447l-1.873.85V19h1.873v-.623c.4.496.945.814 1.809.814 2.112 0 3.424-1.519 3.424-4.287 0-2.672-1.409-4.271-3.393-4.271-.848 0-1.44.334-1.84.798zm-5.224.033a1.112 1.112 0 0 0 0 2.223c.624 0 1.103-.495 1.103-1.12 0-.607-.48-1.103-1.103-1.103zm-9.832.32V19h7.361v-1.84h-5.441V7.8zm25.83 2.833c-.816 0-1.36.367-1.68 1.039v-.848h-1.873V19h1.873v-4.576c0-1.552.815-1.952 1.535-1.952.624 0 1.057.192 1.393.432l.271-1.713a2.276 2.276 0 0 0-1.52-.558zm5.976 0c-1.376 0-2.463.398-3.199.894l.576 1.522c.688-.48 1.44-.77 2.432-.77 1.072 0 1.6.416 1.6 1.488v.432c-.513-.288-1.168-.432-1.936-.432-1.616 0-3.2.817-3.2 2.705 0 1.792 1.28 2.72 2.96 2.72 1.088 0 1.775-.433 2.175-.849V19h1.825v-5.264c0-2.752-1.793-3.103-3.233-3.103zm9.024 0c-.816 0-1.36.367-1.68 1.039v-.848h-1.873V19h1.873v-4.576c0-1.552.815-1.952 1.535-1.952.624 0 1.057.192 1.393.432l.271-1.713a2.276 2.276 0 0 0-1.52-.558zm-31.942.191V19h1.871v-8.176zm34.184 0l3.072 8.047-1.263 3.232h1.935l4.32-11.279h-1.888l-1.92 5.023c-.096.272-.16.48-.225.737a4.92 4.92 0 0 0-.24-.737l-1.902-5.023zm-26.432 1.584c1.136 0 1.776.88 1.776 2.496 0 1.536-.608 2.496-1.776 2.496-.72 0-1.248-.273-1.584-.785v-3.408c.24-.368.8-.8 1.584-.8zm14.944 2.959c.608 0 1.198.128 1.63.336v1.057a2.489 2.489 0 0 1-1.824.785c-.976 0-1.486-.433-1.486-1.073 0-.784.752-1.105 1.68-1.105z"/>
  </g>
  <g role="image" id="read">
    <title>Read input from user</title>
    <path id="read-shape" fill="#fff" stroke="#281845" stroke-width="1.5" d="M24 40h80v32H24z"/>
    <path id="read-title" fill="#250657" d="M80.682 50.129l-1.393.654v3.297c-.464-.416-1.104-.767-2.064-.767-2.032 0-3.375 1.583-3.375 4.271 0 2.64 1.295 4.287 3.375 4.287.976 0 1.6-.352 2.064-.832v.64h1.393zm-33.364.352V61.68h1.393v-4.8h2.48l2.303 4.8h1.569l-2.4-4.897c1.871-.384 2.608-1.79 2.608-3.119 0-1.584-.849-3.183-3.537-3.183zm1.393 1.294h3.057c1.648 0 2.095 1.088 2.095 1.92 0 .928-.527 1.89-2.095 1.89H48.71zm11.77 1.538c-2.177 0-3.631 1.567-3.631 4.271 0 2.496 1.39 4.287 3.63 4.287 1.104 0 2.033-.447 2.641-1.055l-.848-.945a2.446 2.446 0 0 1-1.76.737c-1.231 0-2.128-.975-2.24-2.479h5.536c.032-.32.048-.674.048-.93 0-2.688-1.537-3.886-3.377-3.886zm8.53 0c-1.231 0-2.304.43-2.96.863l.4 1.168c.608-.432 1.471-.817 2.383-.817 1.056 0 1.777.4 1.777 1.84v.576c-.672-.384-1.393-.527-2.113-.527-1.584 0-3.055.815-3.055 2.703 0 1.824 1.184 2.752 2.848 2.752.976 0 1.776-.431 2.32-.943v.752h1.31v-5.424c0-2.512-1.63-2.943-2.91-2.943zm-8.53 1.232c.863 0 1.952.542 1.968 2.398h-4.191c.08-1.68 1.038-2.398 2.222-2.398zm16.937.047c.944 0 1.567.56 1.871 1.04v3.84c-.416.705-1.103 1.104-1.871 1.104-1.344 0-2.16-1.296-2.16-2.992 0-1.92.784-2.992 2.16-2.992zm-8.727 3.023c.672 0 1.424.241 1.92.545v1.408c-.464.544-1.201 1.073-2.113 1.073-1.12 0-1.744-.61-1.744-1.522 0-1.04.881-1.504 1.937-1.504z"/>
  </g>
  <path fill="#250657" d="M142.152 52.369a6.248 6.248 0 0 1 1.13 2.88H104v1.5h39.281a6.032 6.032 0 0 1-1.129 2.852l9.834-3.615z">
    <title>After reading, begin parsing</title>
  </path>
  <g role="image" id="parse">
    <title>Parse input into operations</title>
    <path id="parse-shape" fill="#fff" stroke="#281845" stroke-width="1.5" d="M152 40h80v32h-80z"/>
    <path id="parse-title" fill="#250657" d="M172.902 50.305v11.2h1.393v-4.497h2.896c2.624 0 3.616-1.808 3.616-3.344 0-1.664-.896-3.359-3.616-3.359zm1.393 1.295h2.992c1.68 0 2.127 1.184 2.127 2.064 0 .96-.543 2.05-2.127 2.05h-2.992zm11.236 1.537c-1.232 0-2.303.431-2.959.863l.4 1.168c.609-.432 1.471-.816 2.383-.816 1.056 0 1.778.4 1.778 1.84v.576c-.672-.384-1.393-.527-2.113-.527-1.584 0-3.055.815-3.055 2.703 0 1.824 1.184 2.752 2.848 2.752.976 0 1.776-.432 2.32-.944v.752h1.31V56.08c0-2.512-1.632-2.943-2.912-2.943zm8.647 0c-.912 0-1.568.448-1.936 1.264v-1.073h-1.392v8.176h1.392v-4.607c0-1.856 1.04-2.385 1.824-2.385.56 0 .912.176 1.168.352l.207-1.311c-.288-.24-.735-.416-1.263-.416zm5.21 0c-1.567 0-2.751.816-2.751 2.16 0 1.344 1.025 1.999 2.529 2.559.96.368 1.871.737 1.871 1.553 0 .72-.655 1.039-1.52 1.039-.88 0-1.583-.527-2-.975l-.992.848c.64.816 1.76 1.375 2.96 1.375 1.775 0 2.911-.847 2.911-2.319 0-1.552-1.168-2.192-2.656-2.72-.912-.368-1.726-.672-1.726-1.36 0-.576.527-.912 1.36-.912.88 0 1.456.415 1.808.783l.959-.8c-.592-.705-1.504-1.231-2.752-1.231zm8.333 0c-2.176 0-3.631 1.568-3.631 4.272 0 2.496 1.39 4.287 3.63 4.287 1.105 0 2.033-.447 2.641-1.055l-.847-.945a2.446 2.446 0 0 1-1.76.736c-1.232 0-2.128-.977-2.24-2.48h5.535c.032-.32.049-.672.049-.928 0-2.688-1.537-3.887-3.377-3.887zm0 1.23c.864 0 1.952.545 1.968 2.4h-4.19c.08-1.68 1.038-2.4 2.222-2.4zm-22.508 3.073c.672 0 1.424.24 1.92.545v1.408c-.464.544-1.201 1.072-2.113 1.072-1.12 0-1.745-.61-1.745-1.521 0-1.04.882-1.504 1.938-1.504z"/>
  </g>
  <path id="parse-to-evaluate" fill="#250657" d="M191.25 72v39.281a6.032 6.032 0 0 1-2.852-1.129l3.616 9.834 3.617-9.834a6.248 6.248 0 0 1-2.88 1.13V72z">
    <title>After parsing, begin evaluating</title>
  </path>
  <g role="image" id="evaluate">
    <title>Evaluate parsed operations</title>
    <path id="evaluate-shape" fill="#fff" stroke="#281845" stroke-width="1.5" d="M152 120h80v32h-80z"/>
    <path id="evaluate-title" fill="#250657" d="M189.4 130.129l-1.392.654v10.897h1.392zm21.995 0l-1.393.672v2.703h-1.328v1.217h1.328v5.199c0 1.152.496 1.951 1.728 1.951.64 0 1.137-.143 1.569-.367l.16-1.36c-.352.225-.753.432-1.217.432-.72 0-.847-.497-.847-1.12v-4.735h2.015v-1.217h-2.015zm-49.258.352v11.199h7.008v-1.328h-5.616v-3.807h3.473v-1.312h-3.473v-3.442h5.264v-1.31zm20.472 2.832c-1.232 0-2.303.43-2.959.863l.4 1.168c.609-.432 1.472-.817 2.384-.817 1.056 0 1.777.4 1.777 1.84v.576c-.672-.384-1.393-.527-2.113-.527-1.584 0-3.055.815-3.055 2.703 0 1.824 1.184 2.752 2.848 2.752.976 0 1.776-.431 2.32-.943v.752h1.31v-5.424c0-2.512-1.632-2.943-2.912-2.943zm21.594 0c-1.232 0-2.303.43-2.959.863l.4 1.168c.609-.432 1.471-.817 2.383-.817 1.056 0 1.778.4 1.778 1.84v.576c-.672-.384-1.394-.527-2.114-.527-1.584 0-3.054.815-3.054 2.703 0 1.824 1.183 2.752 2.847 2.752.976 0 1.777-.431 2.32-.943v.752h1.311v-5.424c0-2.512-1.632-2.943-2.912-2.943zm14.283 0c-2.176 0-3.63 1.567-3.63 4.271 0 2.496 1.39 4.287 3.63 4.287 1.104 0 2.033-.446 2.64-1.054l-.847-.946a2.446 2.446 0 0 1-1.76.737c-1.231 0-2.128-.975-2.24-2.479h5.535c.032-.32.05-.674.05-.93 0-2.688-1.538-3.886-3.378-3.886zm-47.795.191l2.993 8.176h1.168l2.992-8.176h-1.393l-1.904 5.457c-.096.288-.176.51-.256.799-.08-.288-.16-.511-.256-.799l-1.935-5.457zm21.344 0v4.72c0 2.625 1.057 3.647 2.977 3.647.864 0 1.52-.27 2.064-.974v.783h1.393v-8.176h-1.393v4.96c0 1.6-.817 2.112-1.889 2.112-1.008 0-1.76-.592-1.76-2.144v-4.928zm26.451 1.041c.864 0 1.953.542 1.97 2.398h-4.192c.08-1.68 1.038-2.398 2.222-2.398zm-36.195 3.07c.672 0 1.424.241 1.92.545v1.408c-.464.544-1.201 1.073-2.113 1.073-1.12 0-1.744-.61-1.744-1.522 0-1.04.881-1.504 1.937-1.504zm21.594 0c.672 0 1.424.241 1.92.545v1.408c-.464.544-1.202 1.073-2.114 1.073-1.12 0-1.744-.61-1.744-1.522 0-1.04.882-1.504 1.938-1.504z"/>
  </g>
  <path id="evaluate-to-print" fill="#250657" d="M104.014 136.013l9.834 3.617a6.248 6.248 0 0 1-1.13-2.88H152v-1.5h-39.281a6.033 6.033 0 0 1 1.129-2.852z">
    <title>After evaluating, begin printing</title>
  </path>
  <g role="image" id="print">
    <title>Print the result of the evaluated model</title>
    <path id="print-shape" fill="#fff" stroke="#281845" stroke-width="1.5" d="M24 120h80v32H24z"/>
    <path id="print-title" fill="#250657" d="M78.424 130.129l-1.39.672v2.703h-1.329v1.217h1.328v5.199c0 1.152.495 1.951 1.727 1.951.64 0 1.136-.143 1.568-.367l.16-1.36c-.352.225-.75.432-1.215.432-.72 0-.85-.497-.85-1.12v-4.735h2.018v-1.217h-2.017zm-14.23.127c-.48 0-.864.4-.864.896 0 .48.383.864.863.864.496 0 .881-.384.881-.864a.882.882 0 0 0-.88-.896zm-16.682.225v11.199h1.392v-4.496H51.8c2.624 0 3.617-1.808 3.617-3.344 0-1.664-.897-3.36-3.617-3.36zm1.392 1.294h2.99c1.68 0 2.13 1.185 2.13 2.065 0 .96-.545 2.049-2.13 2.049h-2.99zm11.79 1.538c-.913 0-1.568.447-1.936 1.263v-1.072h-1.393v8.176h1.393v-4.608c0-1.856 1.04-2.384 1.824-2.384.56 0 .912.175 1.168.351l.207-1.31c-.288-.24-.736-.416-1.264-.416zm10.363 0c-.88 0-1.6.319-2.112 1.023v-.832h-1.392v8.176h1.392v-4.977c0-1.584.815-2.111 1.887-2.111 1.008 0 1.76.592 1.76 2.144v4.944h1.392v-4.703c0-2.64-1.071-3.664-2.927-3.664zm-7.551.191v8.176h1.392v-8.176z"/>
  </g>
  <path id="print-to-read" fill="#250657" d="M63.986 72.014l-3.617 9.834a6.248 6.248 0 0 1 2.881-1.129V120h1.5V80.72a6.032 6.032 0 0 1 2.852 1.128z">
    <title>After printing, begin reading again</title>
  </path>
</svg>

The library encompasses the underlying logic and processing, and the program is just a shell that takes input to pass to the library and displays the output for the current state.

In the library, the parser and the evaluator are designed as two separate pieces. The parser handles unknown input from the outside world and transforms it into a data type that represents valid operations. This data is then passed to the evaluator, which doesn't have to worry about the validity of what it received because all it receives is data that has been verified to be correct by the parser. This allows it to focus solely on evaluating the operations without becoming a mess of code, and the parser can just focus on turning text into operations. This separation of concerns allows for easier and more straightforward testing, in addition to helping quickly narrow scope during debugging.

The stack used is [Node][], running compiled [TypeScript][]. Testing is done using [Jest][] and [jest-fuzz][].

## Retrospective

Several things immediately come to mind when thinking about what I could have done differently in this project, most of which boil down to not knowing the audience which I'm writing for:

1. **Use a language with a better developer experience.** TypeScript is a popular language for doing large-scale JavaScript development, but being popular does not always mean something is the best tool for the job. There are other compile-to-JavaScript languages with a better developer experience that could have been used instead, such as [Elm][][^1]. In retrospect, I should have asked for clarification on the exact requirements for this task and not assumed I needed to use the most mainstream option.

2. **Use immutable data structures.** You likely noticed defensiveness in ensuring things weren't and couldn't be mutated, despite my insistence on avoiding such practices. There is also overhead with how it was approached, which can been mitigated with [persistent data structures][]. In retrospect, I should have gone with my instinct and used [Immutable.js][] out of the gate instead of assuming it to possibly be foreign to others, if not a language that has immutability as one of its core features.

3. **Make branches to split up large commits into grouped, atomic commits.** This sort of behavior makes more sense when introducing new features, especially on an established codebase, but it would be helpful here in stepping through the development process in a more visible way.

There are also some features I wanted to implement while writing the program, but they would have involved a fair bit of effort without better tooling:

4. **Provide friendly errors.** Capturing position information to create a way to show specifically where issues occurred with bad input would have been wonderful. Combined with the REPL's ability to recall past inputs, it would make resolving errors quick and painless.

5. **Provide live calculation previews while typing.** Some REPLs provide instant feedback about what the result will be before you commit to whatever you're typing. I've found this helpful many times, and I believe it would be a good addition here, too.

## Author

Devan Ferguson (@68kHeart)

## License

Copyright © 2022 Devan Ferguson. All rights reserved.

You may not use or reproduce this code without explicit consent from the author.



[^1]: When evaluating frameworks for internal tools at my last job, React, Redux, and TypeScript was the widely recommended stack, which I tried during my evaluation of different solutions to meet our needs. Through Redux, my studies with Haskell, and enthusiastic recommendation by one of my partners, I tried Elm and ended up getting all the features the above stack promised and more. In all my work in building data processing tools and programs, I have not had a reason to switch away from it; I've found it fast, robust, and easier to understand than other compile-to-JavaScript languages. "Zero runtime errors" is also a great selling point I haven't found to be inaccurate in any way.



[Elm]: https://elm-lang.org "Elm homepage"

[Immutable.js]: https://immutable-js.com "Immutable.js homepage"

[Jest]: https://jestjs.io "Jest homepage"

[jest-fuzz]: https://github.com/jeffersonmourak/jest-fuzz "GitHub: jest-fuzz, by jeffersonmourak"

[Node]: https://nodejs.org/ "Node.js homepage"

[persistent data structures]: https://en.wikipedia.org/wiki/Persistent_data_structure "Wikipedia: Persistent data structure"

[TypeScript]: https://www.typescriptlang.org "TypeScript homepage"

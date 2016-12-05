// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as diff from 'diff';
import * as os from 'os';
import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as vscode from 'vscode-languageserver';

import * as parser from '../src/parsing/coq-parser';
import * as ast from '../src/parsing/ast-types';


describe.only("coq-parser", function() {
  function loc(start: number, end?: number) : ast.LocationRange {
    return {
      start: {
        offset: start,
        line: 1,
        column: start+1
      },
      end: {
        offset: (end || start),
        line: 1,
        column: (end || start)+1
      }}
  }

  function ident(name: string, start: number, end?: number) : ast.Identifier {
    return {text: name, loc: loc(start,end || start + name.length)}
  }
  function inductive(bodies, text, rest) : ast.SInductive {
    return {type: 'inductive', kind: "Inductive", bodies: bodies, text: text, rest: rest}
  }
  function indBody(name:string,offset:number, binders: ast.Binder[], constructors: ast.Constructor[],type:string|null=null) : ast.InductiveBody {
    return {ident: ident(name,offset), termType: type, binders: binders, constructors: constructors}
  }


  it('parseSentenceLength', function() {
    assert.equal(parser.parseSentenceLength('Inductive w(k:E):=(). ('), 21);
  })

  it('sentenceLength - SAny', function() {
    assert.deepStrictEqual(parser.parseSentence('Inductive w(k:E):=(). ('), {type: 'any', text: 'Inductive w(k:E):=().', rest: ' ('});
  })

  it('sentenceLength - SInductive', function() {
    assert.deepStrictEqual(parser.parseSentence('Inductive w := a. ('),
      inductive([indBody("w",10, [], [{ident: ident("a", 15), binders: [], term: null}])], 'Inductive w := a.', ' ('));
    assert.deepStrictEqual(parser.parseSentence('Inductive w : Prop := a. ('),
      inductive([indBody("w", 10, [], [{ident: ident("a", 22), binders: [], term: null}], "Prop")], 'Inductive w : Prop := a.', ' ('));
  })

});
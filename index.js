/* This file is part of node-sword-web-api.

   Copyright (C) 2024 node-sword-web-api Development Team <contact@ezrabibleapp.net>

   node-sword-web-api is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 2 of the License, or
   (at your option) any later version.

   node-sword-web-api is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with node-sword-web-api. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

WEB_API_ROOT = 'http://localhost:3000';

module.exports.setApiRoot = function(api_root) {
  WEB_API_ROOT = api_root;
};

module.exports.getFromWebApi = async function(url) {
  try {
    const response = await fetch(WEB_API_ROOT + url);

    if (!response.ok) {
      console.error('Network response was not ok for ' + URL + ': ' + response.statusText);
      return -1;
    }

    const data = await response.json(); // Parsing the JSON from the response
    return data;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return -1;
  }
};

module.exports.moduleHasBook = async function(moduleCode, bookCode) {
  return await this.getFromWebApi(`/module/${moduleCode}/hasbook/${bookCode}`);
};

module.exports.getRawModuleEntry = async function(moduleCode, key) {
  return await this.getFromWebApi(`/module/${moduleCode}/raw/${key}`);
};

module.exports.getReferenceText = async function(moduleCode, key) {
  return await this.getFromWebApi(`/module/${moduleCode}/text/${key}`);
};

module.exports.getChapterText = async function(moduleCode, bookCode, chapter) {
  return await this.getFromWebApi(`/module/${moduleCode}/chaptertext/${bookCode}/${chapter}`);
};

module.exports.getBookText = async function(moduleCode, bookCode, startVerseNr=-1, verseCount=-1) {
  return await this.getFromWebApi(`/module/${moduleCode}/booktext/${bookCode}/${startVerseNr}/${verseCount}`);
};

module.exports.getVersesFromReferences = async function(moduleCode, references) {
  const referenceString = references.join(',');
  return await this.getFromWebApi(`/module/${moduleCode}/versesfromreferences/${referenceString}`);
};

module.exports.getReferencesFromReferenceRange = async function(referenceRange) {
  return await this.getFromWebApi(`/local/referencesfromrange/${referenceRange}`);
};

module.exports.getBookList = async function(moduleCode) {
  return await this.getFromWebApi(`/module/${moduleCode}/books`);
};

module.exports.getBookChapterCount = async function(moduleCode, bookCode) {
  return parseInt(await this.getFromWebApi(`/module/${moduleCode}/bookchaptercount/${bookCode}`));
};

module.exports.getChapterVerseCount = async function(moduleCode, bookCode, chapter) {
  return parseInt(await this.getFromWebApi(`/module/${moduleCode}/chapterversecount/${bookCode}/${chapter}`));
};

module.exports.getBookIntroduction = async function(moduleCode, bookCode) {
  return await this.getFromWebApi(`/module/${moduleCode}/bookintro/${bookCode}`)
};

module.exports.getModuleBookStatus = async function(bookCode) {
  return await this.getFromWebApi(`/local/modulebookstatus/${bookCode}`);
};

module.exports.hebrewStrongsAvailable = async function() {
  return await this.getFromWebApi('/strongs/hebrewstrongsavailable');
};

module.exports.greekStrongsAvailable = async function() {
  return await this.getFromWebApi('/strongs/greekstrongsavailable');
};

module.exports.strongsAvailable = async function() {
  return await this.getFromWebApi('/strongs/strongsavailable');
};

module.exports.getStrongsEntry = async function(strongsKey) {
  return await this.getFromWebApi(`/strongs/strongsentry/${strongsKey}`);
};

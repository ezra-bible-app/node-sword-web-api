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

module.exports.getFromWebApi = async function(url, json=true) {
  try {
    const response = await fetch(WEB_API_ROOT + url);

    if (!response.ok) {
      console.error('Network response was not ok for ' + url + ': ' + response.statusText);
      return -1;
    }

    if (json) {
      return await response.json(); // Parsing the JSON from the response
    } else {
      return 0;
    }

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return -1;
  }
};

module.exports.getLocalModule = async function(moduleCode) {
  return await this.getFromWebApi(`/module/${moduleCode}`);
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

module.exports.getBookHeaderList = async function(moduleCode, bookCode, startVerseNr=-1, verseCount=-1) {
  return await this.getFromWebApi(`/module/${moduleCode}/bookheaderlist/${bookCode}/${startVerseNr}/${verseCount}`);
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

module.exports.getAllChapterVerseCounts = async function(moduleCode, bookCode) {
  return await this.getFromWebApi(`/module/${moduleCode}/allchapterversecounts/${bookCode}`);
};

module.exports.getBookVerseCount = async function(moduleCode, bookCode) {
  return parseInt(await this.getFromWebApi(`/module/${moduleCode}/bookversecount/${bookCode}`));
};

module.exports.getBookIntroduction = async function(moduleCode, bookCode) {
  return await this.getFromWebApi(`/module/${moduleCode}/bookintro/${bookCode}`)
};

module.exports.getModuleBookStatus = async function(bookCode) {
  return await this.getFromWebApi(`/local/modulebookstatus/${bookCode}`);
};

module.exports.getModuleSearchResults = async function(moduleCode,
                                                       searchTerm,
                                                       progressCB,
                                                       searchType,
                                                       searchScope,
                                                       isCaseSensitive,
                                                       useExtendedVerseBoundaries) {

  const moduleSearchSessionId = await this.getFromWebApi('/module/searchsession');
  if (moduleSearchSessionId == -1) {
    console.error('Could not get a search session id from the remote server!');
    return -1;
  }

  const startSearchUrl = `/module/${moduleCode}/search/${moduleSearchSessionId}/${searchTerm}/${searchType}/${searchScope}/${isCaseSensitive}/${useExtendedVerseBoundaries}`;
  this.getFromWebApi(startSearchUrl, false);

  const progressURL = `/module/searchprogress/${moduleSearchSessionId}`;

  return new Promise((resolve, reject) => {
    const checkFinishInterval = setInterval(async () => {

      const progressUpdate = await this.getFromWebApi(progressURL);
      if (progressUpdate == -1) {
        console.error('Progress update for search on remote server failed!');
        clearInterval(checkFinishInterval);
        reject(-1);

      } else if (progressUpdate.progress != null) {
        progressCB(progressUpdate.progress);

        if (progressUpdate.status === 'completed') {
          const results = await this.getFromWebApi(`/module/searchresults/${moduleSearchSessionId}`);
          clearInterval(checkFinishInterval);

          if (results == -1) {
            console.error('Search results could not be retrieved from remote server!');
            reject(-1);
          } else {
            resolve(results);
          }
        }
      }
    }, 200);
  });
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

module.exports.getAllLocalModules = async function(moduleType) {
  return await this.getFromWebApi(`/local/modules/${moduleType}`);
};

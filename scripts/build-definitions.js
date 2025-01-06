const fs = require('fs');
const { keyboardDefinitionV2ToVIADefinitionV2, keyboardDefinitionV3ToVIADefinitionV3 } = require('@the-via/reader');
const { createHmac } = require('node:crypto');

function buildDefinitions() {
  if (fs.existsSync('./public/definitions/v2')) {
    fs.rmdirSync('./public/definitions/v2', { recursive: true });
  }
  if (fs.existsSync('./public/definitions/v3')) {
    fs.rmdirSync('./public/definitions/v3', { recursive: true });
  }

  console.log('Building...');

  const vpids = { v2: [], v3: [] };

  for (const version of ['v2', 'v3']) {
    if (!fs.existsSync(`./public/keyboards/${version}`)) continue;
    fs.mkdirSync(`./public/definitions/${version}`, { recursive: true });
    for (const filename of fs.readdirSync(`./public/keyboards/${version}`)) {
      if (!filename.endsWith('.json')) continue;
      const keyboardDefinition = require(`../public/keyboards/${version}/${filename}`);
      const viaDefinition = version === 'v2'
        ? keyboardDefinitionV2ToVIADefinitionV2(keyboardDefinition)
        : keyboardDefinitionV3ToVIADefinitionV3(keyboardDefinition);
      fs.writeFileSync(`./public/definitions/${version}/${filename}`, JSON.stringify(viaDefinition, null, 2));
      vpids[version].push(viaDefinition.vendorProductId);
    }
  }

  const supportedKbs = require('../public/definitions/supported_kbs.json');
  supportedKbs.vendorProductIds = vpids;
  fs.writeFileSync('./public/definitions/supported_kbs.json', JSON.stringify(supportedKbs, null, 2));

  const hash = hashJSON(supportedKbs);

  fs.writeFileSync('./public/definitions/hash.json', hash);
}

const hashJSON = (json) => hashText(JSON.stringify(json));

const hashText = (text) => {
  const hmac = createHmac('sha256', 'a secret');
  hmac.update(text);
  return hmac.digest('hex');
};

buildDefinitions();

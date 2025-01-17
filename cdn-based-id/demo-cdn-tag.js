/**
 * Contents in this file are replaced by cloud function when it runs on the Edge, near the user, embedding information in the file without passing data to LinkedIn.
 * Without cookies, we can thus create identifiers that are consistent.
 * With the help of 1P only cookies, or localStorage as additional layers, we can pretty consistently establish a more deternministic identification, with no tracking or PII sharing.
 */

/**
 * Code below is what user should download as part of the JS tag in their browser. This should be served from CDN.
 */

(function() {
  // Create a DIV element
  var container = document.createElement('div');
  container.style.cssText = 'padding: 20px; background: #f9f9f9; border: 1px solid #ddd; margin: 20px 0; font-family: Arial, sans-serif;';

  // Define placeholder values
  var values = {
    value1: '2601:647:4d80:ae60:1486:db5f:b30a:7cdd',
    value2: 'Sunnyvale',
    value3: 'US',
    value4: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    value5: 'America/Los_Angeles',
    tagId1: 'af557df2a821e0b8995ca1263f110a7958759056c6477abb3fa542b48c9a771b',
    tagId2: 'd37d5db7031170d75cea4e184dabd9040a4477805de8a53dfca868640ab9ce03',
  };

  // Create the content block with placeholders
  container.innerHTML = `
    <p><strong>IP:</strong> ${values.value1}</p>
    <p><strong>City:</strong> ${values.value2}</p>
    <p><strong>Country:</strong> ${values.value3}</p>
    <p><strong>User Agent:</strong> ${values.value4}</p>
    <p><strong>Time Zone:</strong> ${values.value5}</p>
    <p><strong>Your IP based Tag ID:</strong> ${values.tagId1}</p>
    <p><strong>Your IP + "today" + userAgent Tag ID:</strong> ${values.tagId2}</p>
  `;

  // Append the container to the body
  document.body.appendChild(container);
})();

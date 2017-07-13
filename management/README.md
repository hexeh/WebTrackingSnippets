
# Web Analytics Management Snippets

## Saving info about subaccounts in Google Analytics for specific user

1. Open [Account Explorer](https://ga-dev-tools.appspot.com/account-explorer/)
2. Type **UA** in the searchbox.
3. Via console, run code from *ga_accounts.js*
4. Get your ga.json file

**File content**: array of json:

```json
{
  "Account": "Account Name",
  "Account ID": "ID",
  "Property": "Property Name",
  "Property ID": "ID",
  "View": "View Name",
  "View ID": "ID",
  "Table ID": "ID"
}
```

## Saving info about subaccounts in Google Tag Manager for specific user

1. Open [GTM Home Page](https://tagmanager.google.com/?authuser=0#/home)
2. Via console, run code from *gtm_accounts.js*
3. Via console, run following

```javascript
download(getGTM('csv'), 'gtm', 'csv') // Downloads csv-file with name "gtm.csv"
download(getGTM(), 'gtm') // Downloads json-file with name "gtm.json"
```

**File content**: array of json or comma-separated values.

JSON:

```json
{
        "Account Name": "Name",
        "Account ID": "ID",
        "Childs": [
            {
                "Container Name": "Name",
                "Container ID": "ID"
            }
        ]
    }
```

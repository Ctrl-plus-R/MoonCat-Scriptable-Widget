# MoonCat-Scriptable-Widget
an IOS widget programmed with Scriptable that shows a different random MoonCat based on user-defined filters in each widget refresh loop

## Requirements
- device with iOS
- Scriptable app
- Moralis account with API key

## Setup
1. add mooncat-scriptable-widget.js to Scriptable app
  - either by pressing the plus icon in the Scriptable App and copy, paste the code
  - or by putting the file into your iCloud Drive into the Scriptable folder
1. add widget to your homescreen
   - long press
   - plus icon
   - search “Scriptable”
   - all sizes work, but small and large look best
1. click widget to reach the settings
  - choose mooncat-scriptable-widget as Script
  - it does not matter what to choose as interaction
  - add [config](#config) to parameter field

## Config
You must enter a configuration in the parameter field of your widget.
The config is a json string and is therefore enclosed in curly brackets.
It consists of your moralis API key and optional additional setting parameters.

A minimum configuration looks like this (with your own API key):
```json
{
  "moralisApiKey": "YOUR_API_KEY"
}
```
This would show a random rescued cat in front of the cat’s inverted glow color on your widget.

A longer configuration could look likes this (with actual wallet ids):
```json
{
  "moralisApiKey": "YOUR_API_KEY",
  "background": "black",
  "filter": ["wallets", "genesis"],
  "wallets": ["0x...", "0x..."]
}
```
This would randomly display a cat from one of the two wallets or a genesis cat.

Don’t forget the quotation marks around keys and string values.

### Optional Parameters
The following parameters can optionally be added to the config.

1. Background Color
  - Key: background
  - Type: string
  - Values: black, white, blue, brown, cyan, darkGray, gray, green, lightGray, magenta, orange, purple, red, yellow
  - Default: inverted glow color of the displayed cat
  - Example: `"background": "black"`
1. Filter
  - Key: filter
  - Type: string or array of strings
  - Values: wallets, rescue, lunar, genesis
  - Default: random rescued cat
  - Example: `"filter": "black"`
  - Note: If this parameter includes or equals "wallets", the config also needs a valid wallets parameter
1. Wallets
  - Key: wallets
  - Type: string or array of strings
  - Values: 0x...
  - Example: `"filter": "wallets", "wallets": "0x..."`
  - Notes:
      - filter parameter must include or equal "wallets" otherwise this parameter is ignored
      - only acclimatized cats can be detected




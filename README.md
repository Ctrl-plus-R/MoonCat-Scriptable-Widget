# MoonCat-Scriptable-Widget
IOS widget programmed with [Scriptable](https://scriptable.app/) that shows a different random MoonCat based on user-defined filters in each widget refresh loop

## General
You can have several widgets at once with different settings.
Each widget can show a specific cat, switch between a selection or even change randomly.
Wallets can also be specified to define the selection of cats. 
iOS takes care of updating the widgets independently.
You can also set a background for the widget.

## Requirements
- device with iOS
- installed [Scriptable app](https://scriptable.app/)
- Moralis account with API key

## Setup
1. add mooncat-scriptable-widget.js to Scriptable app
  - either by pressing the plus icon in the Scriptable app and copy, paste the code
  - or by putting the file into your iCloud drive into the Scriptable folder
2. add widget to your homescreen
  - long press
  - plus icon
  - search “Scriptable”
  - all sizes work, but small and large look best
3. click widget to reach the settings
  - choose mooncat-scriptable-widget as script
  - it probably doesn’t matter what to choose as interaction
  - add [config](#config) to parameter field

## Config
You must enter a configuration in the parameter field of your widget.
The config is a json string and is therefore enclosed in curly brackets.
It consists of your moralis API key and optional additional setting parameters.

Don’t forget the quotation marks around keys and string values as shown in the [exxamples](#example-configurations).

### Optional Parameters
The following parameters can optionally be added to the config.

1. Background Color
  - Key: background
  - Type: string
  - Values: black, white, blue, brown, cyan, darkGray, gray, green, lightGray, magenta, orange, purple, red, yellow
  - Default: inverted glow color of the displayed cat
  - Example: `"background": "black"`
2. Filter
  - Key: filter
  - Type: string or array of strings
  - Values: wallets, rescue, lunar, genesis
  - Default: random rescued cat
  - Example: `"filter": "lunar"`
  - Note: If this parameter includes or equals "wallets", the config also needs a valid wallets parameter
3. Wallets
  - Key: wallets
  - Type: string or array of strings
  - Values: 0x...
  - Example: `"filter": "wallets", "wallets": "0x..."`
  - Notes:
    - filter parameter must include or equal "wallets" otherwise this parameter is ignored
    - only acclimatized cats can be detected

[ ] backgroundImage
[ ] cats

### Example Configurations

#### Minimum
A minimum configuration looks like this (with your own API key):
```json
{
  "moralisApiKey": "YOUR_API_KEY"
}
```
This would show a random rescued cat in front of the cat’s inverted glow color on your widget.

#### Mixed Filter
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


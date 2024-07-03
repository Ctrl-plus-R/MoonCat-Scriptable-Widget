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
- [Moralis](https://moralis.io/) account with API key

## Setup
1. add mooncat-scriptable-widget.js to Scriptable app
   - either press the plus icon in the Scriptable app and copy+paste the code
   - or put the file into the Scriptable folder in your iCloud drive
3. add widget to your homescreen
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
The config is a json string and therefore enclosed in curly brackets.
It consists of your Moralis API key and optional additional settings.

Don’t forget the quotation marks around keys and string values as shown in the [examples](#example-configurations).

### Optional Parameters
The following parameters can optionally be added to the config.

#### 1. Filter
- Key: `"filter"`
- Type: string or array of strings
- Values: `"wallets"`, `"specific"` or (see [cat types](#cat-types))
- Default: rescued
- Example: `"filter": "lunar"`
- Notes:
  - If this parameter includes or equals "wallets", the config also needs a "wallets" parameter
  - If this parameter includes or equals "specific", the config also needs a "cat" or "cats" parameter
  
#### 2. Cat
- Key: `"cat"`
- Type: string (catId) or number (rescueIndex)
- Values: catId (e. g. `"0x0012345678"`) or rescueIndex (e. g. `0–25439`)
- Example: `"filter": "specific", "cat": "0x00d51b8121"`
- Notes:
  - filter parameter must include or equal "specific" otherwise this parameter is ignored
  - if there is also a "cats" parameter, "cats" is ignored
  
#### 3. Cats
- Key: "`cats`"
- Type: string (catId), number (rescueIndex) or array of both
- Values: catId or rescueIndex
- Example: `"filter": "specific", "cats": [392, "0x00d8523a53"]`
- Notes:
  - filter parameter must include or equal "specific" otherwise this parameter is ignored
  - if there also is a "cat" parameter, "cats" is ignored
  
#### 4. Wallets
- Key: `"wallets"`
- Type: string or array of strings
- Values: walletId (e.g. `"0x..."`)
- Example: `"filter": "wallets", "wallets": "0x..."`
- Notes:
  - filter parameter must include or equal "wallets" otherwise this parameter is ignored
  - only acclimatized cats can be detected
  
#### 5. Background Color

|         |                                          |
| ------- | ---------------------------------------- |
| Key     | `"background"`                           |
| Type    | string                                   |
| Values  | `"black"`, `"white"`, `"blue"`, `"brown"`, `"cyan"`, `"darkGray"`, `"gray"`, `"green"`, `"lightGray"`, `"magenta"`, `"orange"`, `"purple"`, `"red"`, `"yellow"` |
| Default | inverted glow color of the displayed cat |
| Example | `"background": "black"`                  |

#### 6. Background Image
- Key: `"backgroundImage"`
- Type: string
- Values: a valid link to a jpg or png
- Example: `"backgroundImage": "https://mooncat.community/img/bgstarssmall.png"`
- Note: be aware that the image will be downloaded with every refresh because no use of local storage has yet been implemented

### Cat Types
This is the categorization of all cats as used in the optional [filter parameter](#filter) of the [configuration](#config).

| Type             | Description             |
| ---------------- | ----------------------- |
| `"rescued"`      | minted, non-genesis     |
| `"lunar"`        | non-minted, non-genesis |
| `"genesis"`      | minted, genesis         |
| `"hero"`         | non-minted, genesis     |
| `"colored"`      | rescued + lunar         |
| `"colorless"`    | genesis + hero          |
| `"domesticated"` | rescued + genesis       |
| `"wild"`         | lunar + hero            |

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

#### Specific Cat
```json
{
  "moralisApiKey": "YOUR_API_KEY",
  "filter": "specific",
  "cat": 392
}
```
This will always show the same magnificent cat.

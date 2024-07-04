# MoonCat-Scriptable-Widget
IOS widget programmed with [Scriptable](https://scriptable.app/) that shows a different random MoonCat based on user-defined filters in each widget refresh loop

## GENERAL
You can have several widgets at once with different settings.
Each widget can show a specific cat, switch between a selection or even change randomly.
Wallets can also be specified to define the selection of cats. 
iOS takes care of updating the widgets independently.
You can also set a background for the widget.

## REQUIREMENTS
- device with iOS
- installed [Scriptable app](https://scriptable.app/)
- for advanced features: [Moralis](https://moralis.io/) account with API key

## SETUP
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
   - if you want to customize your widget, add [config](#config) to parameter field

## CONFIG
To customize your widgets you need to enter a configuration in the parameter field of your widget settings.
The config is a json string and therefore enclosed in curly brackets.
Also don’t forget the quotation marks around keys and string values as shown in the [examples](#example-configurations).

The config can consist of the following parameters:

<a name="config-filter"></a>
|         | Filter                                                     |
| ------- | :--------------------------------------------------------- |
| Key     | `"filter"`                                                 |
| Type    | string                                                     |
| Values  | `"cats"`, `"wallets"` or (see [cat types](#cat-types))     |
| Default | rescued                                                    |
| Example | `"filter": "lunar"`                                        |
| Notes   | - `"cats"` requires another parameter [`"cats"`](#config-cats) <br> - `"wallets"` requires two other parameters [`"moralisApiKey"`](#config-moralis-api-key) and [`"wallets"`](#config-wallets) |

<a name="config-moralis-api-key"></a>
|         | Moralis API Key                                                       |
| ------- | :-------------------------------------------------------------------- |
| Key     | `"moralisApiKey"`                                                     |
| Type    | string                                                                |
| Example | `"moralisApiKey": "YOUR_API_KEY"`                                     |
| Note    | only needed in order to use the [`"wallets"` filter](#config-wallets) |

<a name="config-cats"></a>
|         | Cats                                                  |
| ------- | :---------------------------------------------------- |
| Key     | `"cats"`                                              |
| Type    | string (catId), number (rescueIndex) or array of both |
| Values  | catId or rescueIndex                                  |
| Example | `"cats": [392, "0x00d8523a53"]`                       |
| Note    | requires [`"filter": "cats"`](#config-filter)         |
  
<a name="config-wallets"></a>
|         | Wallets                                                                              |
| ------- | :----------------------------------------------------------------------------------- |
| Key     | `"wallets"`                                                                          |
| Type    | string or array of strings                                                           |
| Values  | walletId (40-digit hex string, e.g. `"0x..."`)                                       |
| Example | `"wallets": "0x..."`                                                                 |
| Notes   | - requires [`"filter": "wallets"`](#config-filter) <br> - only finds acclimated cats |
  
<a name="config-background-color"></a>
|          | Background Color                                   |
| -------- | :------------------------------------------------- |
| Key      | `"background"`                                     |
| Type     | string                                             |
| Values   | `"black"`, `"white"`, `"blue"`, `"brown"`, `"cyan"`, `"darkGray"`, `"gray"`, `"green"`, `"lightGray"`, `"magenta"`, `"orange"`, `"purple"`, `"red"`, `"yellow"`, [hex string](https://www.color-hex.com/) (3- or 6-digit) |
| Default  | inverted glow color of the displayed cat           |
| Examples | `"background": "black"`, `"background": "#dfbcbb"` |


<a name="config-background-image"></a>
|         | Background Image                                                                             |
| ------- | :------------------------------------------------------------------------------------------- |
| Key     | `"backgroundImage"`                                                                          |
| Type    | string                                                                                       |
| Values  | a valid link to a jpg or png                                                                 |
| Example | `"backgroundImage": "https://mooncat.community/img/bgstarssmall.png"`                        |
| Note    | image is downloaded each time the widget is updated, as cashing has not yet been implemented |

### Cat Types
This is the categorization of all cats as used in the config parameter [filter](#config-filter).

| Type             | Description             |
| :--------------- | :---------------------- |
| `"rescued"`      | minted, non-genesis     |
| `"lunar"`        | non-minted, non-genesis |
| `"genesis"`      | minted, genesis         |
| `"hero"`         | non-minted, genesis     |
| `"colored"`      | rescued + lunar         |
| `"colorless"`    | genesis + hero          |
| `"domesticated"` | rescued + genesis       |
| `"wild"`         | lunar + hero            |
| `"all"`          | all cats                |

### Example Configurations

#### 1. No configuration
A widget without configuration shows a random domesticated cat (rescued or genesis) in front of its inverted glow color.

#### 2. Specific cat
```json
{
  "filter": "cats",
  "cats": 392
}
```
This would always show the same magnificent cat in front of its inverted glow color.
Note that the parameter is called `"cats"` with “s” even if the value is only a single cat.

#### 3. Cats from multiple wallets
To access wallets you need a Moralis API key.
```json
{
  "moralisApiKey": "YOUR_API_KEY",
  "background": "black",
  "filter": "wallets",
  "wallets": ["0x...", "0x..."]
}
```
This would display a random cat from one of the two wallets against a black background, each cat with the same probability.
Instead of an array of wallet ids, you can also enter just a single value.

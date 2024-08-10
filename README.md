# Gmail-Gemini
Transforms the ways you read emails with Gemini

[![](https://markdown-videos-api.jorgenkh.no/youtube/HikVSo_nPa0)](https://youtu.be/HikVSo_nPa0)


## Example
* Original email
![Video](video/gmail-original.gif)

* With Gemini Gmail
![resumen](img/imagen-3.png)

The application uses Gemini API to transform the way you manage your emails. With it, you can generate automated summaries and organize emails in specific categories, such as work, finance, and personal, all with an approach to flexibility and ease.

The objective of this application is not only to reduce daily workload, but also ensure that no important email is lost among digital noise.

With Gmail Gemini, now managing your inbox becomes a quick and efficient task, enhancing your productivity and freeing time for what really matters.

## Build
1. Move the **"./src"** folder files to an environment in **Scripts Apps**
2. Configure your **Gemini** token in "gemini.gs"
![alt text](img/image-1.png)
3. Configure a **trigger** pointing to the Main function in **App scripts**
    * By default in your drive an Spreadsheet file will be created with the name **"Gmail-Gemini"**
![Trigger](img/image.png)

4. Choose a personalized view in Appsheet
    * I did not find a way of being able to export or share my APP SHEET configuration without exposing my data 😦
![Config App Sheet](img/image-2.png)
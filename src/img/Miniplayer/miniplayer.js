/*
©2000 Microsoft Corporation. All rights reserved.
*/

function OnOpenStateChange()
{
    if(player.OpenState == osMediaOpen)
    {
        UpdateMetadata();
    }
}

function UpdateMetadata()
{
    metadata.value = player.currentmedia.getiteminfo("author");
    var temp = player.currentmedia.name;
    if(temp != "")
    {
        if(metadata.value != "")
        {
            metadata.value +=  " -- ";
        }
        metadata.value += temp;
    }
    metadata.scrolling = metadata.textWidth>metadata.width;
}
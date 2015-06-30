Bootstrap Vertical Tabs
=======================

Vertical tabs component for Bootstrap 3. Works with 3.0.0+ to 3.3.0.

![screenshot](screenshot.png)

### Install
* Via bower (recommended):  
```bash  
  bower install bootstrap-vertical-tabs
```
* Or you can just clone, [download (v1.1.1)](https://github.com/dbtek/bootstrap-vertical-tabs/archive/1.1.1.zip) from GitHub.

### Usage

* [Get](https://github.com/dbtek/bootstrap-vertical-tabs#install) the package.
* Include in your html.

```html
<link rel="stylesheet" href="bootstrap.vertical-tabs.css">
```

* Use it.

#### Left Tabs
```html
<div class="col-xs-3"> <!-- required for floating -->
    <!-- Nav tabs -->
    <ul class="nav nav-tabs tabs-left">
      <li class="active"><a href="#home" data-toggle="tab">Home</a></li>
      <li><a href="#profile" data-toggle="tab">Profile</a></li>
      <li><a href="#messages" data-toggle="tab">Messages</a></li>
      <li><a href="#settings" data-toggle="tab">Settings</a></li>
    </ul>
</div>

<div class="col-xs-9">
    <!-- Tab panes -->
    <div class="tab-content">
      <div class="tab-pane active" id="home">Home Tab.</div>
      <div class="tab-pane" id="profile">Profile Tab.</div>
      <div class="tab-pane" id="messages">Messages Tab.</div>
      <div class="tab-pane" id="settings">Settings Tab.</div>
    </div>
</div>  
```

#### Right Tabs
```html
<div class="col-xs-9">
  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane active" id="home-r">Home Tab.</div>
    <div class="tab-pane" id="profile-r">Profile Tab.</div>
    <div class="tab-pane" id="messages-r">Messages Tab.</div>
    <div class="tab-pane" id="settings-r">Settings Tab.</div>
  </div>
</div>

<div class="col-xs-3"> <!-- required for floating -->
  <!-- Nav tabs -->
  <ul class="nav nav-tabs tabs-right">
    <li class="active"><a href="#home-r" data-toggle="tab">Home</a></li>
    <li><a href="#profile-r" data-toggle="tab">Profile</a></li>
    <li><a href="#messages-r" data-toggle="tab">Messages</a></li>
    <li><a href="#settings-r" data-toggle="tab">Settings</a></li>
  </ul>
</div>
```
####Sideways Tabs :new:

Add `sideways` class to tabs.

Example:
```
  <ul class="nav nav-tabs tabs-left sideways">
    ...
```

![screenshot vertical texts](screenshot-v.png)

Further, take a look at included demo!

### License
[MIT](opensource.org/licenses/MIT)

### Author
Ismail Demirbilek, [@dbtek](http://twitter.com/dbtek).


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dbtek/bootstrap-vertical-tabs/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

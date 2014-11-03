(function () {
   // Make underscore syntax more like handlebars 
   _.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

  $('#main-content').append('<div id="app"></div>');

  window.app = {
    Views: {},
    Router: null,
    getURLParameter: function(name){ 
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null; 
    },
    getParam: function(name){
        var name = this.getURLParameter(name);
        if(!name || !_.isString(name) || $.trim(name).length == 0){return false}
        return $.trim(name);
    },
    hasValue: function(name){
        return !_.isNull(this[name]) && !_.isUndefined(this[name]) && this[name];
    },
    validateEmail: function(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validateExpiry: function(expiry){
        // Check the expiry date is MM/YYYY
        var re = /^\d{2}\/\d{4}$/;
        if(!re.test(expiry)){
            return false;
        }

        // Check that expiry date isn't in the past (year at least).
        var arr = expiry.split('/');
        if(parseInt(arr[1]) < ((new Date).getFullYear())){
            return false;
        }
    
        return true;
    },
    validateCVV: function(cvv){
        // Check the cvv is between 3-4 digits
        var re = /^\d{3,4}$/;
        return re.test(cvv);
    },
    validateNameOnCard: function(name){
        // Check name is at least a string a few chars long
        return _.isString(name) && name.length > 3;
    },
    validateCreditcard: function(){
    },
    clientSideValidate: function(){
        var result = true;

        // Reset the messages / colours if validated previously.
        $('.has-error .help-block').text('');
        $('.has-error').removeClass('has-error');
        $('.text-danger').removeClass('text-danger');

        // Cycle through each input field.
        $('form input').each(function(){
            var $input = $(this);
            var type = $input.attr('type');
            var $parent = $input.parent();
            var $message = $('.help-block',$parent);
            var value = $.trim($input.val());

            // Create a message block if none exists
            if($message.length == 0){
                $parent.append('<div class="help-block"></div>');
                $message = $('.help-block',$parent);
            }

            // All text fields are required
            if(type == 'text' && value.length == 0){
                $parent.addClass('has-error');
                $message.text('Required!');
                result = false;
            }

            // Email field must be an email
            if(type == 'email' && !app.validateEmail(value)){
                $parent.addClass('has-error');
                $message.text('Not an email!');
                result = false;
            }

            // The one and only checkbox is required
            if(type == 'checkbox' && !$input.prop('checked')){
                $parent.addClass('text-danger');
                result = false;
            }

            // Credit card 
            // Credit card number
            if($input.attr('id') == 'cardNumber'){
                if($input.attr('data-card-valid') == 'false'){
                    $parent.addClass('has-error');
                    $message.text('Invalid card number!');
                    result = false;
                }
            }
            // Credit card expiry 
            if($input.attr('id') == 'expiryDate' && !app.validateExpiry(value)){
                $parent.addClass('has-error');
                $message.text('Invalid format!');
                result = false;
            }
            // Credit card cvv
            if($input.attr('id') == 'cvv' && !app.validateCVV(value)){
                $parent.addClass('has-error');
                $message.text('Invalid format!');
                result = false;
            }
        });
        return result;
    },
    isSubmitting : false,
    serverSideValidate: function(){
        $('#next').addClass('disabled').attr('disabled','disabled');
        $('#next').append(' <i class="fa fa-cog fa-spin"></i>');
          this.isSubmitting = true;
          $.ajax({
              // replace with correct url / pass in as variable
              url: 'https://forms.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=577&deploy=1&compid=3338669&h=fd4b556df517d80177e4',
              data: {
                    'customer' : this.accountName,
                     'invoice' : this.invoiceNumber
              },
              type: 'GET',
              dataType : 'json'
          }).done(function(r){
              var value = r.valid;
              if(!r.hasOwnProperty('valid')){
                  app.showAlert('danger','<p><strong>Error!</strong> There was a problem communicating with the server. Please try again later. Your card has <strong>not</strong> been charged. Please contact <a href="https://www.apnic.net/helpdesk" target="_blank">APNIC Helpdesk</a> to make a payment.</p>');
              }else if(!value){
                  app.showAlert('warning','<p><strong>Whoops!</strong> The account and/or invoice number supplied are not valid. Please re-check them, or contact <a href="https://www.apnic.net/helpdesk" target="_blank">APNIC Helpdesk</a> for assistance.');
              }else if(value && r.hasOwnProperty('paidinfull') && r.paidinfull){
                  app.showAlert('warning','<p><strong>Whoops!</strong> There is no outstanding payment on the account/invoice number you supplied. Please re-check them, or contact <a href="https://www.apnic.net/helpdesk" target="_blank">APNIC Helpdesk</a> for assistance.');

              }else if(value && r.hasOwnProperty('paidinfull') && !r.paidinfull){
                  app.clearAlert();
                   app.currency = r.currency;
                   app.amount = r.amountremaining;
                   app.router.navigate("confirmation", {trigger: true});
              }else{
                  app.showAlert('danger','<p><strong>Error!</strong> There was a problem communicating with the server. Please try again later. Your card has <strong>not</strong> been charged. Please contact <a href="https://www.apnic.net/helpdesk" target="_blank">APNIC Helpdesk</a> to make a payment.</p>');
              }
          }).fail(function(x){
              app.showAlert('danger','<p><strong>Error!</strong> There was a problem communicating with the server. Please try again later. Your card has <strong>not</strong> been charged. Please contact <a href="https://www.apnic.net/helpdesk" target="_blank">APNIC Helpdesk</a> to make a payment.</p>');
          }).always(function(){
              app.isSubmitting = false;
              $('#next').removeClass('disabled').removeAttr('disabled');
              $('.fa','#next').remove();
          });
    },
    clearAlert: function(){
        var $alert = $('[role="alert"]:first');
        if($alert.length != 0){
            $alert.remove();
        }
    },
    showAlert: function(type,message){
        this.clearAlert();
        var alert_class = "danger";
        if(type == 'success' || type == 'info' || type == 'warning'){
            alert_class = type;
        }
        var alert = '<div class="alert alert-'+alert_class+'" role="alert">'+message+'</div>';
        $('h1:first').after(alert);
        $('html, body').animate({
            scrollTop: $("h1:first").offset().top
        }, 500);
             
        //app.router.navigate("error", {trigger: true});
    },
    submit: function(){
          this.isSubmitting = true;
          $.ajax({
              // replace with correct url / pass in as variable
              url: 'https://forms.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=585&deploy=1&compid=3338669&h=d5d603f4dc17c8276041',
              data: {
                    'customer' : this.accountName,
                     'invoice' : this.invoiceNumber,
                          'email' : this.email,
                       'cardno' : this.ccnumber,
                         'nameOnCreditCard' : this.ccname,
                       'expiry' : this.ccexpiry,
                 'cvv' : this.ccsecuritycode
              },
              type: 'POST',
              dataType : 'json'
          }).done(function(r){
              if(r.result == 'valid'){
                   showSuccess();
              }else{
                   showFailure();
              }
          }).fail(function(x){
              this.showFailure();
          }).always(function(){
              this.isSubmitting = false;
          });
    },

    init: function () {

      this.accountName = this.getParam('accountName');
      if(!this.hasValue('accountName')){
          this.accountName = this.getParam('accountno');
      }

      this.invoiceNumber = this.getParam('invoiceNumber');
      if(!this.hasValue('invoiceNumber')){
          this.invoiceNumber = this.getParam('tranid');
      }

      this.email = this.getParam('emailAddress');
      if(!this.hasValue('email')){
          this.email = this.getParam('email');
      }


      window.location.hash = '';
      this.router = new app.Router();
      Backbone.history.start();

    }
  };

  $(function() {
    window.app.init();
  });

  app.Router = Backbone.Router.extend({

    routes: {
                'cvv' : 'cvv',
              'terms' : 'terms',
            'success' : 'success',
              'error' : 'error',
       'confirmation' : 'confirmation',
                  ''  : 'home'
    },

    home: function () {
      var view = new app.Views.Home();
      view.render();
    },

    error: function () {
      var view = new app.Views.Error();
      view.render();
    },

    cvv: function () {
      var view = new app.Views.CVV();
      view.render();
    },

    terms: function () {
      var view = new app.Views.Terms();
      view.render();
    },

    confirmation: function () {
      var view = new app.Views.Confirmation();
      view.render();
    },

    success: function () {
      var view = new app.Views.Success();
      view.render();
    }

  });

  app.Views.Home = Backbone.View.extend({

    el: '#app',
    className: 'home',

    render: function () {
      var template = _.template($('[id=page1]').html());
      this.$el.html(template());

      // Store the form field values when user changes them.
      $('input[type=checkbox]').bind('change', function() {
          app.agree = $(this).prop('checked');
      });
      $('#apnicAccountName').bind('input propertychange', function() {
          app.accountName = $(this).val();
      });
      $('#invoiceNumber').bind('input propertychange', function() {
          app.invoiceNumber = $(this).val();
      });
      $('#emailAddress').bind('input propertychange', function() {
          app.email = $(this).val();
      });
      $('#cardName').bind('input propertychange', function() {
          app.ccname = $(this).val();

          var $parent = $(this).parent();
          var $message = $('.help-block',$parent);

          if(!app.validateNameOnCard(app.ccname)){
              $parent.addClass('has-error').removeClass('has-success');
          }else{
              $parent.addClass('has-success').removeClass('has-error');
              $message.text('');
          }
      });
      $('#cardNumber').bind('input propertychange', function() {
          app.ccnumber = $(this).val();
      });
      // Validate cc number
      $('#cardNumber').validateCreditCard(function(result){
          if(!app.hasOwnProperty('cc_field')){
              app.cc_field = {
                  $input        : $('#cardNumber'),
                  $div          : $('#cardNumber').parent(),
                  $validmarker  : $('span',$('#cardNumber').parent()),
                  $cardtype     : $('#credit-card-type'),
                  cardtype      : ''
              }
          }
          var cc_field = app.cc_field;

          var fa_type = 'fa fa-credit-card';

          try{ cc_field.cardtype = result.card_type.name; }catch(e){}
          if(cc_field.cardtype.length > 0){
              fa_type = 'fa fa-cc-' + cc_field.cardtype;
          }
          cc_field.$cardtype.attr('class',fa_type);
          var valid = result.length_valid && result.luhn_valid;
          cc_field.$input.attr('data-card-valid',valid);
          cc_field.$input.attr('data-card-type',cc_field.cardtype);
          if(valid){
              cc_field.$div.addClass('has-success has-feedback').removeClass('has-error');
              cc_field.$validmarker.addClass('glyphicon glyphicon-ok form-control-feedback');
              $('.help-block',app.cc_field.$div).text('')
          }
          else{
              cc_field.$div.removeClass('has-success has-feedback');
              cc_field.$validmarker.removeClass('glyphicon glyphicon-ok form-control-feedback');
          }
      });
      $('#expiryDate').bind('input propertychange', function() {
          app.ccexpiry = $(this).val();
          var $parent = $(this).parent();
          var $message = $('.help-block',$parent);

          if(!app.validateExpiry(app.ccexpiry)){
              $parent.addClass('has-error').removeClass('has-success');
          }else{
              $parent.addClass('has-success').removeClass('has-error');
              $message.text('');
          }
      });
      $('#CVV').bind('input propertychange', function() {
          app.ccsecuritycode = $(this).val();
          var $parent = $(this).parent();
          var $message = $('.help-block',$parent);

          if(!app.validateCVV(app.ccsecuritycode)){
              $parent.addClass('has-error').removeClass('has-success');
          }else{
              $parent.addClass('has-success').removeClass('has-error');
              $message.text('');
          }
      });
      $('#next').bind('click',function(e){
          e.preventDefault();
          if(app.clientSideValidate() && !app.isSubmitting){
              app.serverSideValidate();
          }
      });
    }

  });

  app.Views.CVV = Backbone.View.extend({

    el: '#app',
    className: 'cvv',

    render: function () {
      var template = _.template($('[id=page5]').html());
      this.$el.html(template());
    }

  });
  app.Views.Error = Backbone.View.extend({

    el: '#app',
    className: 'error',

    render: function () {
      var template = _.template($('[id=page6]').html());
      this.$el.html(template());
    }
  });


  app.Views.Terms = Backbone.View.extend({

    el: '#app',
    className: 'terms',

    render: function () {
      var template = _.template($('[id=page4]').html());
      this.$el.html(template());
    }

  });

  app.Views.Confirmation = Backbone.View.extend({

    el: '#app',
    className: 'confirmation',

    render: function () {
      var template = _.template($('[id=page2]').html());
      this.$el.html(template());

      $('#paynow').bind('click',function(){alert('hook this up to the submit function.')});
    }

  });

  app.Views.Success = Backbone.View.extend({

    el: '#app',
    className: 'success',

    render: function () {
      var template = _.template($('[id=page3]').html());
      this.$el.html(template());
    }

  });

}());


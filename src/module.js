//Its up to the user to use form type help or not.
try {
  //This throws an expection if module does not exist.
  angular.module('ngSanitize');

  angular.module('schemaForm',['ngSanitize']);
} catch (e) {
  angular.module('schemaForm',[]);
}

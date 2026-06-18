<?php
$output = shell_exec('git fetch --all 2>&1; git reset --hard origin/main 2>&1');
echo "<pre>Autodeploy output:\n$output</pre>";
?>

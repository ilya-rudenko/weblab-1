<?php

function validate_number($val, $min, $max){
    return isset($val) && is_numeric($val) && ($val>=$min) && ($val<=$max);
}

function validate_timezone($timezone) {
    return isset($timezone);
}

// Проверка на попадание в область

function check_first_area($x, $y, $r){
    return ($x*$x + $y*$y <= $r*$r && $y>=0 && $x>=0);
}

function check_second_area($x, $y, $r){
    return ($x<=0 && $y>=0 && $x>=-$r && $y<=$r/2);
}

function check_third_area($x, $y, $r){
    return ($x<=0 && $y<=0 && $x>=-2*$y-$r);
}

session_start();
if (!isset($_SESSION['data']))
    $_SESSION['data'] = array();


$x = @$_POST["X"];
$y = @$_POST["Y"];
$R = @$_POST["R"];

$timezone_offset_minutes= @$_POST["timezone_offset_minutes"];
$timezone_name = timezone_name_from_abbr("", $timezone_offset_minutes*60, false);
date_default_timezone_set($timezone_name);

for ($i = 0;$i<count($R);$i++) {
    $r = $R[$i];

    if (validate_number($x, -5, 3) && validate_number($y, -5, 5) && validate_number($r, 1, 5)) {
        $is_inside = check_first_area($x, $y, $r) || check_second_area($x, $y, $r) || check_third_area($x, $y, $r);
        $hit_fact = $is_inside ? "Hit" : "Miss";

        $current_time = date("j M o G:i:s T");
        $execution_time = round((microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']) * 1000, 4);

        $answer = array("x" => $x, "y" => $y, "r" => $r, "hit_fact" => $hit_fact, "current_time" => $current_time, "execution_time" => $execution_time);
        array_unshift($_SESSION['data'], $answer);
    }
}
foreach ($_SESSION['data'] as $elem) {
    echo "<tr class='columns'>";
    echo "<td>" . $elem['x'] . "</td>";
    echo "<td>" . $elem['y'] . "</td>";
    echo "<td>" . $elem['r'] . "</td>";
    echo "<td>" . $elem['hit_fact'] . "</td>";
    echo "<td>" . $elem['current_time'] . "</td>";
    echo "<td>" . $elem['execution_time'] . "</td>";
    echo "</tr>";
}
?>
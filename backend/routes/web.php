<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::redirect('/login', '/')->name('login');
Route::redirect('/register', '/')->name('register');

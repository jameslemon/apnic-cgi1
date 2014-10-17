#!/usr/bin/perl -w
use strict;
use warnings;
my $my_ip = $ENV{REMOTE_ADDR};
print "Content-Type: text/plain\n\n";
print "function getIP(){return '$my_ip'}\n";

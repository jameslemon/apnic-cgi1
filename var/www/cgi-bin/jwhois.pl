#!/usr/bin/perl -w

use strict;
use warnings;

use CGI;
use IO::Socket;

my $socket = IO::Socket::INET->new(
		Proto => "tcp",
		PeerAddr => "jwhois.apnic.net",
		PeerPort => 43,
) or die "Cannot connect to jwhois server";

my $query = CGI->new;
my $source_ip = $query->param('ip') || $ENV{REMOTE_ADDR} || "202.12.29.20";
# my $source_ip = $ENV{REMOTE_ADDR} || "202.12.29.20";

print "Content-Type: text/plain\n\n";

print $socket "$source_ip\n";

my $data = eval {local $/; <$socket>};
chomp($data);
$data =~ s/^\s+//; $data =~ s/\s+$//; $data .= "\n";
$data =~ s/\n/\r\n/g;
print $data;

close $socket;

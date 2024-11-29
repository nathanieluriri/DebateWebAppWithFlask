from flask import Blueprint, request, jsonify


docs=Blueprint('i', __name__)

@docs.route('/create_user', methods=['GET'])
def create_user_docs():
    return jsonify({
        "route": "/create_user",
        "method": "POST",
        "description": "Creates a new user.",
        "request_body": {
            "userName": {
                "type": "string",
                "description": "The username for the new user. Must be unique.",
                "required": True
            },
            "password": {
                "type": "string",
                "description": "The password for the new user. Minimum 6 characters.",
                "required": True
            },
            "isAdmin": {
                "type": "integer",
                "description": "Indicates whether the user is an admin (1 for admin, 0 for normal user). Default is 0.",
                "required": False
            }
        },
        "response": {
            "201": {
                "description": "User created successfully",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "User created successfully"
                    }
                }
            },
            "400": {
                "description": "Bad request, missing username or password",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Username and password are required"
                    }
                }
            },
            "409": {
                "description": "Conflict, username already exists",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Username already exists"
                    }
                }
            },
            "500": {
                "description": "Internal server error",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Error message from the server"
                    }
                }
            }
        }
    })


@docs.route('/get_all_topics', methods=['GET'])
def get_all_topics_docs():
    return jsonify({
        "route": "/get_all_topics",
        "method": "GET",
        "description": "Fetches all topics from the database.",
        "request_body": None,  # No request body needed for GET requests
        "response": {
            "200": {
                "description": "List of topics fetched successfully",
                "body": [
                    {
                        "topicID": {
                            "type": "integer",
                            "description": "The unique ID of the topic"
                        },
                        "topicName": {
                            "type": "string",
                            "description": "The name of the topic"
                        },
                        "postingUser": {
                            "type": "string",
                            "description": "The user who posted the topic"
                        },
                        "creationTime": {
                            "type": "integer",
                            "description": "Unix timestamp for when the topic was created"
                        },
                        "updateTime": {
                            "type": "integer",
                            "description": "Unix timestamp for the last time the topic was updated"
                        }
                    }
                ],
                "example": [
                    {
                        "topicID": 1,
                        "topicName": "Python Programming",
                        "postingUser": "john_doe",
                        "creationTime": 1617892341,
                        "updateTime": 1617923456
                    },
                    {
                        "topicID": 2,
                        "topicName": "Flask Web Development",
                        "postingUser": "alice_smith",
                        "creationTime": 1617892901,
                        "updateTime": 1617924567
                    }
                ]
            },
            "404": {
                "description": "No topics found",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "No topics found"
                    }
                }
            }
        }
    })




@docs.route('/get_related_claims', methods=['GET'])
def get_related_claims_docs():
    return jsonify({
        "route": "/get_related_claims",
        "method": "POST",
        "description": "Fetches related claims for a given claim ID.",
        "request_body": {
            "first_claim_id": {
                "type": "integer",
                "description": "The ID of the first claim for which related claims are being fetched. Required.",
                "required": True
            }
        },
        "response": {
            "200": {
                "description": "Successfully fetched related claims.",
                "body": {
                    "related_claims": {
                        "type": "array",
                        "description": "A list of related claims for the given first claim ID.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "claim_id": {
                                    "type": "integer",
                                    "description": "The ID of the related claim"
                                },
                                "claim_type": {
                                    "type": "string",
                                    "description": "The type of the related claim"
                                },
                                "claim_status": {
                                    "type": "string",
                                    "description": "The status of the related claim"
                                },
                                "relationship_type": {
                                    "type": "string",
                                    "description": "The type of relationship (e.g., 'parent', 'child')"
                                }
                            }
                        }
                    }
                },
                "example": {
                    "related_claims": [
                        {
                            "claim_id": 101,
                            "claim_type": "Insurance",
                            "claim_status": "Pending",
                            "relationship_type": "parent"
                        },
                        {
                            "claim_id": 102,
                            "claim_type": "Insurance",
                            "claim_status": "docsroved",
                            "relationship_type": "child"
                        }
                    ]
                }
            },
            "400": {
                "description": "Bad request, missing required field or invalid data.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Missing required field: first_claim_id"
                    }
                }
            },
            "404": {
                "description": "No related claims found.",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "No related claims found for the given first claim."
                    }
                }
            },
            "500": {
                "description": "Internal server error when fetching related claims.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "An error occurred while fetching related claims."
                    }
                }
            }
        }
    })




@docs.route('/login', methods=['GET'])
def login_docs():
    return jsonify({
        "route": "/login",
        "method": "POST",
        "description": "Authenticates the user based on username and password and updates the last visit timestamp.",
        "request_body": {
            "userName": {
                "type": "string",
                "description": "The username of the user trying to log in. Required.",
                "required": True
            },
            "password": {
                "type": "string",
                "description": "The password of the user trying to log in. Required.",
                "required": True
            }
        },
        "response": {
            "200": {
                "description": "Successfully logged in.",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "Login successful"
                    },
                    "userID": {
                        "type": "integer",
                        "description": "The user ID of the logged-in user."
                    }
                }
            },
            "400": {
                "description": "Bad request, missing username or password.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Username and password are required"
                    }
                }
            },
            "401": {
                "description": "Unauthorized, invalid password.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Invalid password"
                    }
                }
            },
            "404": {
                "description": "User not found.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "User not found"
                    }
                }
            }
        }
    })


@docs.route('/logout', methods=['GET'])
def logout_docs():
    return jsonify({
        "route": "/logout",
        "method": "GET",
        "description": "Logs out the user by clearing the session and redirects to the home page.",
        "response": {
            "200": {
                "description": "Successfully logged out. The user is redirected to the home page.",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "Successfully logged out."
                    }
                }
            }
        }
    })

@docs.route('/create_claim_relationship', methods=['GET'])
def create_claim_relationship_docs():
    return jsonify({
        "route": "/create_claim_relationship",
        "method": "POST",
        "description": "Creates a relationship between two claims based on the provided data. The endpoint links two claims using a specified relationship type, such as 'opposing' or equivalent.",
        "request_body": {
            "type": "json",
            "required": "true",
            "description": "The request body should contain a JSON object with the necessary fields to create a claim relationship.",
            "fields": {
                "first": {
                    "type": "integer",
                    "description": "The ID of the first claim. This is a required field to establish the relationship.",
                    "required": "true"
                },
                
                "claimRelType": {
                    "type": "string",
                    "description": "The type of relationship between the two claims. It can be 'Opposing', 'Equivalent', etc. This is a required field.",
                    "required": "true"
                },
                "topicID": {
                    "type": "integer",
                    "description": "The ID of the topic to which the claims are related. This is required for creating a claim for the second claim in the relationship.",
                    "required": "true"
                },
                "userID": {
                    "type": "integer",
                    "description": "The ID of the user creating the second claim. This is required to associate the second claim with a user.",
                    "required": "true"
                },
                "text": {
                    "type": "string",
                    "description": "The text content of the second claim being created. This is required to specify what the second claim is.",
                    "required": "true"
                }
            }
        },
        "response": {
            "201": {
                "description": "Claim relationship created successfully.",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "Claim relationship created successfully!"
                    }
                }
            },
            "400": {
                "description": "Bad request due to missing required fields or other errors during the creation of the claim relationship.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Missing required fields: first, second, or claimRelType"
                    }
                }
            },
            "500": {
                "description": "Internal server error if something goes wrong during the insertion of the claim relationship.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Database error occurred while inserting claim relationship"
                    }
                }
            }
        }
    })




@docs.route('/get_claims_for_topic', methods=['GET'])
def get_claims_for_topic_docs():
    return jsonify({
        "route": "/get_claims_for_topic/<int:topicID>",
        "method": "GET",
        "description": "Fetches all claims associated with a specific topic identified by the topicID.",
        "path_parameters": {
            "topicID": {
                "type": "integer",
                "description": "The ID of the topic for which claims are being fetched. Required."
            }
        },
        "response": {
            "200": {
                "description": "Successfully fetched claims for the given topic.",
                "body": {
                    "claims": {
                        "type": "array",
                        "items": {
                            "claimID": {
                                "type": "integer",
                                "description": "The unique identifier for the claim."
                            },
                            "topic": {
                                "type": "string",
                                "description": "The topic name associated with the claim."
                            },
                            "postingUser": {
                                "type": "string",
                                "description": "The username of the user who posted the claim."
                            },
                            "creationTime": {
                                "type": "integer",
                                "description": "The Unix timestamp when the claim was created."
                            },
                            "updateTime": {
                                "type": "integer",
                                "description": "The Unix timestamp when the claim was last updated."
                            },
                            "text": {
                                "type": "string",
                                "description": "The text content of the claim."
                            }
                        },
                        "example": [
                            {
                                "claimID": 1,
                                "topic": "Climate Change",
                                "postingUser": "john_doe",
                                "creationTime": 1633036800,
                                "updateTime": 1633123200,
                                "text": "The effects of climate change are real and immediate."
                            },
                            {
                                "claimID": 2,
                                "topic": "Climate Change",
                                "postingUser": "jane_smith",
                                "creationTime": 1633123200,
                                "updateTime": 1633209600,
                                "text": "We need more global action on reducing carbon emissions."
                            }
                        ]
                    }
                }
            },
            "404": {
                "description": "No claims found for the specified topic.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "No claims found for this topic"
                    }
                }
            }
        }
    })


@docs.route('/get_claim_count_per_topic', methods=['GET'])
def get_claim_count_per_topic_docs():
    return jsonify({
        "route": "/get_claim_count_per_topic",
        "method": "GET",
        "description": "Fetches the total number of claims for each topic.",
        "request": {
            "body": {
                "type": "json",
                "required": "false",
                "description": "No request body is required for this endpoint."
            }
        },
        "response": {
            "200": {
                "description": "Successfully fetched the total number of claims for each topic.",
                "body": {
                    "claims_count": {
                        "type": "array",
                        "items": {
                            "topicID": {
                                "type": "integer",
                                "description": "The ID of the topic."
                            },
                            "total_claims": {
                                "type": "integer",
                                "description": "The total number of claims associated with this topic."
                            }
                        },
                        "example": [
                            {
                                "topicID": 1,
                                "total_claims": 5
                            },
                            {
                                "topicID": 2,
                                "total_claims": 3
                            }
                        ]
                    }
                }
            },
            "400": {
                "description": "Bad request. Request must be in JSON format.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Request must be in JSON format"
                    }
                }
            },
            "404": {
                "description": "No topics found or no claims available.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "No topics found or no claims available"
                    }
                }
            }
        }
    })


@docs.route('/create_reply', methods=['GET'])
def create_reply_docs():
    return jsonify({
        "route": "/create_reply",
        "method": "POST",
        "description": "Creates a reply to a claim or another reply. The reply can either be a 'claim' or a 'reply', and can have an associated relationship type (e.g., 'Supporting Argument', 'Rebuttal').",
        "request": {
            "body": {
                "type": "json",
                "required": "true",
                "description": "The request body should contain a JSON object with the necessary fields to create a reply.",
                "fields": {
                    "text": {
                        "type": "string",
                        "description": "The text content of the reply.",
                        "required": "true"
                    },
                    "userID": {
                        "type": "integer",
                        "description": "The ID of the user creating the reply.",
                        "required": "true"
                    },
                    "replyType": {
                        "type": "string",
                        "description": "The type of reply. Can be 'claim' or 'reply'.",
                        "required": "true"
                    },
                    "relationshipType": {
                        "type": "string",
                        "description": "The relationship type of the reply, e.g., 'Supporting Argument', 'Rebuttal'.",
                        "required": "true"
                    },
                    "claimID": {
                        "type": "integer",
                        "description": "The ID of the claim being replied to (required only if replyType is 'claim').",
                        "required": "false"
                    },
                    "parentReplyID": {
                        "type": "integer",
                        "description": "The ID of the parent reply being replied to (required only if replyType is 'reply').",
                        "required": "false"
                    }
                }
            }
        },
        "response": {
            "201": {
                "description": "Reply created successfully.",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "Reply created successfully"
                    }
                }
            },
            "400": {
                "description": "Bad request. Missing required fields or invalid input.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Missing required fields"
                    }
                }
            },
            "400_invalid_relationship_type": {
                "description": "Invalid relationship type. Must be a valid relationship type.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Invalid relationship type: Supporting Argument for claim"
                    }
                }
            },
            "400_invalid_reply_type": {
                "description": "Invalid replyType. Must be either 'claim' or 'reply'.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Invalid replyType. Must be 'claim' or 'reply'"
                    }
                }
            },
            "400_missing_claimID": {
                "description": "Missing claimID for reply to claim.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Missing claimID for reply to claim"
                    }
                }
            },
            "400_missing_parent_replyID": {
                "description": "Missing parentReplyID for reply to reply.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Missing parentReplyID for reply to reply"
                    }
                }
            }
        }
    })



@docs.route('/create_claim', methods=['GET'])
def create_claim_docs():
    return jsonify({
        "route": "/create_claim",
        "method": "POST",
        "description": "Creates a new claim in a specified topic. The claim requires the topic ID, user ID, and the text of the claim.",
        "request": {
            "body": {
                "type": "json",
                "required": "true",
                "description": "The request body should contain a JSON object with the necessary fields to create a claim.",
                "fields": {
                    "topicID": {
                        "type": "integer",
                        "description": "The ID of the topic in which the claim is being created.",
                        "required": "true"
                    },
                    "userID": {
                        "type": "integer",
                        "description": "The ID of the user creating the claim.",
                        "required": "true"
                    },
                    "text": {
                        "type": "string",
                        "description": "The text content of the claim.",
                        "required": "true"
                    }
                }
            }
        },
        "response": {
            "201": {
                "description": "Claim created successfully.",
                "body": {
                    "message": {
                        "type": "string",
                        "example": "Claim created successfully"
                    }
                }
            },
            "400": {
                "description": "Bad request. Missing required fields.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "topicID, userID, and text are required"
                    }
                }
            },
            "500": {
                "description": "Internal server error. Failed to insert claim into the database.",
                "body": {
                    "error": {
                        "type": "string",
                        "example": "Database connection failed"
                    }
                }
            }
        }
    })
